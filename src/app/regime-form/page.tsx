'use client';

import { FormData, SubscriptionType } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { regimeApi } from '@/lib/api';
import { localStorage as localStorageUtils } from '@/lib/localStorage';
import { Regime } from '@/models/database';
import DirhamIcon from '@/components/icons/DirhamIcon';

function RegimeFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const subscriptionParam = searchParams.get('subscription') as SubscriptionType || 'one-time';
  const [currentStep, setCurrentStep] = useState(1);
  const [product, setProduct] = useState<Regime | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: '',
    skinType: '',
    skinConcerns: [],
    complexion: '',
    allergies: '',
    skincareSteps: [],
    koreanSkincareExperience: '',
    koreanSkincareAttraction: [],
    skincareGoal: [],
    dailyProductCount: '',
    routineRegularity: '',
    purchaseLocation: '',
    budget: '',
    customizedRecommendations: '',
    brandsUsed: '',
    additionalComments: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await regimeApi.getById(productId);
        setProduct(data);

        // Load saved form data from localStorage
        const savedData = localStorageUtils.getFormData(productId);
        if (savedData) {
          setFormData((prev) => ({ ...prev, ...savedData }));
        }

        // Load saved current step from localStorage
        const savedStep = localStorage.getItem(`currentStep_${productId}`);
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }

        // Save selected regime
        localStorageUtils.saveSelectedRegime(productId);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Auto-save form data to localStorage whenever it changes
  useEffect(() => {
    if (
      productId &&
      Object.keys(formData).some(
        (key) =>
          formData[key as keyof FormData] !== '' &&
          formData[key as keyof FormData]?.length > 0
      )
    ) {
      localStorageUtils.saveFormData(formData, productId);
    }
  }, [formData, productId]);

  // Auto-save current step to localStorage whenever it changes
  useEffect(() => {
    if (productId && currentStep > 1) {
      localStorage.setItem(`currentStep_${productId}`, currentStep.toString());
    }
  }, [currentStep, productId]);

  if (loading) {
    return (
      <div className="container section-padding py-40 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section-padding py-40 text-center">
        <h1 className="text-3xl font-bold text-black mb-4">
          Product Not Found
        </h1>
        <p className="text-black mb-8">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <button
          onClick={() => router.push('/')}
          className="btn-primary cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelect = (
    field:
      | 'skinConcerns'
      | 'skincareSteps'
      | 'koreanSkincareAttraction'
      | 'skincareGoal',
    value: string,
    maxSelections?: number
  ) => {
    setFormData((prev) => {
      const currentSelections = prev[field];

      if (currentSelections.includes(value)) {
        // Remove item if already selected
        return {
          ...prev,
          [field]: currentSelections.filter((item) => item !== value),
        };
      } else {
        // Add item if not selected and under limit
        if (maxSelections && currentSelections.length >= maxSelections) {
          return prev; // Don't add if at max limit
        }
        return {
          ...prev,
          [field]: [...currentSelections, value],
        };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < 17 && isStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!product || !productId) return;

    try {
      // Calculate price based on subscription type
      const getPrice = () => {
        switch (subscriptionParam) {
          case '3-months':
            return product.price3Months;
          case '6-months':
            return product.price6Months;
          default:
            return product.priceOneTime;
        }
      };

      const selectedPrice = getPrice();

      // Save cart data to localStorage
      const cartData = {
        regimeId: productId,
        regime: product,
        formData: formData,
        quantity: 1,
        subscriptionType: subscriptionParam,
        totalAmount: selectedPrice,
        finalAmount: selectedPrice,
      };

      localStorageUtils.saveCartData(cartData);

      // Clear the current step from localStorage since form is completed
      localStorage.removeItem(`currentStep_${productId}`);

      // Clear form data since it's completed
      localStorageUtils.clearFormData(productId);

      // Dispatch event to notify other components that form is completed
      window.dispatchEvent(new CustomEvent('formCompleted'));

      // Navigate to cart
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Age range - required
        return formData.age !== '';
      case 2: // Gender - required
        return formData.gender !== '';
      case 3: // Skin type - required
        return formData.skinType !== '';
      case 4: // Primary skin concerns - at least 1 required
        return formData.skinConcerns.length > 0;
      case 5: // Complexion - required
        return formData.complexion !== '';
      case 6: // Allergies - optional
        return true;
      case 7: // Skincare steps - exactly product.stepCount required
        return formData.skincareSteps.length === product.stepCount;
      case 8: // Skincare goals - at least 1 required
        return formData.skincareGoal.length > 0;
      case 9: // Korean skincare experience - required
        return formData.koreanSkincareExperience !== '';
      case 10: // Korean skincare attraction - at least 1 required
        return formData.koreanSkincareAttraction.length > 0;
      case 11: // Daily product count - required
        return formData.dailyProductCount !== '';
      case 12: // Routine regularity - required
        return formData.routineRegularity !== '';
      case 13: // Purchase location - required
        return formData.purchaseLocation !== '';
      case 14: // Budget - required
        return formData.budget !== '';
      case 15: // Customized recommendations - required
        return formData.customizedRecommendations !== '';
      case 16: // Brands used - optional
        return true;
      case 17: // Additional comments - optional
        return true;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              What is your age range?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'].map(
                (age) => (
                  <button
                    key={age}
                    onClick={() => handleInputChange('age', age)}
                    className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                      formData.age === age
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-semibold">{age}</span>
                  </button>
                )
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Gender?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Male', 'Female', 'Prefer not to say'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => handleInputChange('gender', gender)}
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    formData.gender === gender
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{gender}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              What is your skin type?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Normal',
                'Oily',
                'Dry',
                'Combination',
                'Sensitive',
                'Acne-prone',
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => handleInputChange('skinType', type)}
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    formData.skinType === type
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{type}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              What are your primary skin concerns?
            </h2>
            <p className="text-black">
              Select up to 3 options ({formData.skinConcerns.length}/3)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Acne/pimples',
                'Dryness/flakiness',
                'Oily-Skin/Shiny T-zone',
                'Uneven Skin Tone',
                'Dullness',
                'Wrinkles/Fine lines',
              ].map((concern) => (
                <button
                  key={concern}
                  onClick={() => handleMultiSelect('skinConcerns', concern, 3)}
                  disabled={
                    !formData.skinConcerns.includes(concern) &&
                    formData.skinConcerns.length >= 3
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.skinConcerns.includes(concern)
                      ? 'border-primary bg-primary/5 text-primary cursor-pointer'
                      : !formData.skinConcerns.includes(concern) &&
                        formData.skinConcerns.length >= 3
                      ? 'border-gray-200 bg-gray-100 text-black cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <span className="font-semibold">{concern}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              What is your complexion like?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Light', 'Medium', 'Dark'].map((complexion) => (
                <button
                  key={complexion}
                  onClick={() => handleInputChange('complexion', complexion)}
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    formData.complexion === complexion
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{complexion}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              Do you want to share skin concerns with our experts so they can
              tailor your regime with precision?
            </h2>
            <textarea
              value={formData.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              placeholder="Please list any ingredients or products you're allergic to or sensitive to..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
              rows={4}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              Choose your skincare steps:
            </h2>
            <p className="text-black">
              Select exactly {product.stepCount} steps (
              {formData.skincareSteps.length}/{product.stepCount})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Cleanser',
                'Toner',
                'Essence',
                'Serum/Ampoule',
                'Moisturizer',
                'Sunscreen',
                'Mask',
                'Sheet Masks',
                'Eye Cream',
              ].map((step) => (
                <button
                  key={step}
                  onClick={() =>
                    handleMultiSelect('skincareSteps', step, product.stepCount)
                  }
                  disabled={
                    !formData.skincareSteps.includes(step) &&
                    formData.skincareSteps.length >= product.stepCount
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.skincareSteps.includes(step)
                      ? 'border-primary bg-primary/5 text-primary cursor-pointer'
                      : !formData.skincareSteps.includes(step) &&
                        formData.skincareSteps.length >= product.stepCount
                      ? 'border-gray-200 bg-gray-100 text-black cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <span className="font-semibold">{step}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              What&apos;s your skincare goal from using korean products?
            </h2>
            <p className="text-black">
              Select up to 3 options ({formData.skincareGoal.length}/3)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Hydrated/glowing skin',
                'Clear acne-free skin',
                'Brighter, more even complexion',
                'Anti-aging',
                'Overall skin health',
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleMultiSelect('skincareGoal', goal, 3)}
                  disabled={
                    !formData.skincareGoal.includes(goal) &&
                    formData.skincareGoal.length >= 3
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.skincareGoal.includes(goal)
                      ? 'border-primary bg-primary/5 text-primary cursor-pointer'
                      : !formData.skincareGoal.includes(goal) &&
                        formData.skincareGoal.length >= 3
                      ? 'border-gray-200 bg-gray-100 text-black cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <span className="font-semibold">{goal}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              Are you familiar with korean skincare routines?
            </h2>
            <div className="space-y-4">
              {[
                'Yes, I already follow one',
                'Somewhat, but i want to learn more',
                "No, but I'm curious",
              ].map((experience) => (
                <button
                  key={experience}
                  onClick={() =>
                    handleInputChange('koreanSkincareExperience', experience)
                  }
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    formData.koreanSkincareExperience === experience
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{experience}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              What attracts you to korean skincare?
            </h2>
            <p className="text-black">Select all that apply</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Natural ingredients',
                'Gentle formulas',
                'K-pop/K-drama influence',
                'Effective results',
              ].map((attraction) => (
                <button
                  key={attraction}
                  onClick={() =>
                    handleMultiSelect('koreanSkincareAttraction', attraction)
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    formData.koreanSkincareAttraction.includes(attraction)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{attraction}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              How many skincare products do you use daily?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['0', '1-2', '3-4', '5 or more'].map((count) => (
                <button
                  key={count}
                  onClick={() => handleInputChange('dailyProductCount', count)}
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    formData.dailyProductCount === count
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{count}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 12:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              Do you follow a regular skincare routine?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Yes, every day', 'Occasionally', 'No'].map((regularity) => (
                <button
                  key={regularity}
                  onClick={() =>
                    handleInputChange('routineRegularity', regularity)
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    formData.routineRegularity === regularity
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{regularity}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 13:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              Where do you usually buy your skincare products?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Online stores',
                'Pharmacies',
                'Beauty Retailers',
                'Korean specialty shops',
              ].map((location) => (
                <button
                  key={location}
                  onClick={() =>
                    handleInputChange('purchaseLocation', location)
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    formData.purchaseLocation === location
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{location}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 14:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              What is your monthly skincare budget?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Under 100 AED', 'AED 100-250', 'AED 250-500', 'AED 500+'].map(
                (budget) => (
                  <button
                    key={budget}
                    onClick={() => handleInputChange('budget', budget)}
                    className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer flex items-center gap-2 ${
                      formData.budget === budget
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <DirhamIcon
                      size={16}
                      className={
                        formData.budget === budget
                          ? 'text-primary'
                          : 'text-gray-600'
                      }
                    />
                    <span className="font-semibold">
                      {budget.replace('AED ', '').replace(' AED', '')}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        );

      case 15:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              Would you be interested in customized skincare recommendations
              based on your answers?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Yes', 'No'].map((recommendation) => (
                <button
                  key={recommendation}
                  onClick={() =>
                    handleInputChange(
                      'customizedRecommendations',
                      recommendation
                    )
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    formData.customizedRecommendations === recommendation
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{recommendation}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 16:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              What brands have you tried or are currently using?
            </h2>
            <textarea
              value={formData.brandsUsed}
              onChange={(e) => handleInputChange('brandsUsed', e.target.value)}
              placeholder="Please list any skincare brands you have tried or are currently using..."
              className="w-full p-4 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
            />
          </div>
        );

      case 17:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
              Any additional comments or requests?
            </h2>
            <textarea
              value={formData.additionalComments}
              onChange={(e) =>
                handleInputChange('additionalComments', e.target.value)
              }
              placeholder="Please share any additional comments, requests, or specific requirements..."
              className="w-full p-4 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-40">
      <div className="container section-padding">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Customize Your {product.name}
            </h1>
            <p className="text-black">
              Help us create the perfect skincare routine for you
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-primary">
                Step {currentStep} of 17
              </span>
              <span className="text-sm text-black">
                {Math.round((currentStep / 17) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 17) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-8"
          >
            {renderStep()}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-black cursor-not-allowed'
                  : 'bg-gray-200 text-black hover:bg-gray-300 cursor-pointer'
              }`}
            >
              <ArrowLeft size={20} />
              <span>Previous</span>
            </button>

            {currentStep < 17 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  !isStepValid()
                    ? 'bg-gray-100 text-black cursor-not-allowed'
                    : 'btn-primary cursor-pointer'
                }`}
              >
                <span>Next</span>
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-primary cursor-pointer flex items-center gap-2 justify-center"
              >
                Add to Cart - <DirhamIcon size={16} className="!text-white" />{' '}
                {(() => {
                  switch (subscriptionParam) {
                    case '3-months':
                      return product.price3Months;
                    case '6-months':
                      return product.price6Months;
                    default:
                      return product.priceOneTime;
                  }
                })()}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegimeForm() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-black">Loading...</p>
        </div>
      }
    >
      <RegimeFormContent />
    </Suspense>
  );
}
