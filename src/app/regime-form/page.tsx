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
  
  // Check localStorage first for gift recipient flow
  const cartData = typeof window !== 'undefined' ? localStorageUtils.getCartData() : null;
  const isGiftFlow = typeof window !== 'undefined' && window.localStorage.getItem('kregime_gift_recipient') === 'true';
  
  // Get product ID from URL params OR localStorage (for gift recipients)
  const productId = searchParams.get('product') || cartData?.regimeId || null;
  
  // Get subscription type from URL params OR localStorage (for gift recipients)
  const subscriptionParam =
    (searchParams.get('subscription') as SubscriptionType) || 
    cartData?.subscriptionType ||
    (typeof window !== 'undefined' ? window.localStorage.getItem('kregime_gift_subscription') as SubscriptionType : null) ||
    'one-time';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [product, setProduct] = useState<Regime | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGiftRecipient, setIsGiftRecipient] = useState(isGiftFlow || cartData?.giftRecipient === true);
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
        
        // Check if this is a gift recipient first
        const cartData = localStorageUtils.getCartData();
        const isGift = cartData?.giftRecipient === true || 
                       (typeof window !== 'undefined' && window.localStorage.getItem('kregime_gift_recipient') === 'true');
        
        if (isGift) {
          setIsGiftRecipient(true);
        }
        
        // If gift recipient and regime data exists in cart, use it directly
        if (isGift && cartData?.regime) {
          setProduct(cartData.regime);
          
          // Load any existing form data
          if (cartData.formData && Object.keys(cartData.formData).length > 0) {
            setFormData((prev) => ({ ...prev, ...cartData.formData }));
          }
          
          setLoading(false);
          return;
        }
        
        // Otherwise, fetch from API
        const data = await regimeApi.getById(productId);
        setProduct(data);

        // Load from cart data (if user is editing from cart)
        if (cartData && cartData.regimeId === productId && cartData.formData) {
          setFormData((prev) => ({ ...prev, ...cartData.formData }));
          // Save to form data storage so user can continue editing
          localStorageUtils.saveFormData(cartData.formData, productId);
        } else {
          // Otherwise, load saved form data from localStorage
          const savedData = localStorageUtils.getFormData(productId);
          if (savedData) {
            setFormData((prev) => ({ ...prev, ...savedData }));
          }
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

  const handleInputChange = (
    field: keyof FormData,
    value: string,
    autoAdvance: boolean = false
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-advance to next step for single-choice questions
    if (autoAdvance && currentStep < 16) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300); // Small delay for better UX
    }
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
    if (currentStep < 16 && isStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Helper function to calculate discounted price
  const calculatePrice = (subscriptionType: SubscriptionType) => {
    if (!product) return 0;
    if (isGiftRecipient) return 0;

    let price = 0;
    let discount = 0;

    switch (subscriptionType) {
      case '3-months':
        price = product.price3Months;
        discount = product.discount3Months || 0;
        break;
      case '6-months':
        price = product.price6Months;
        discount = product.discount6Months || 0;
        break;
      default:
        price = product.priceOneTime;
        discount = product.discountOneTime || 0;
    }

    if (discount > 0) {
      return price - (price * discount) / 100;
    }
    return price;
  };

  // Helper function to check if there's a discount
  const hasDiscount = (subscriptionType: SubscriptionType) => {
    if (!product) return false;

    switch (subscriptionType) {
      case '3-months':
        return (product.discount3Months || 0) > 0;
      case '6-months':
        return (product.discount6Months || 0) > 0;
      default:
        return (product.discountOneTime || 0) > 0;
    }
  };

  const handleSubmit = async () => {
    if (!product || !productId) return;

    try {
      // Get existing cart data to preserve gift information
      const existingCartData = localStorageUtils.getCartData();
      
      // Calculate price based on subscription type (0 for gift recipients)
      const selectedPrice = calculatePrice(subscriptionParam);

      // Save cart data to localStorage, preserving gift information
      const cartData = {
        regimeId: productId,
        regime: product,
        formData: formData,
        quantity: 1,
        subscriptionType: subscriptionParam,
        totalAmount: selectedPrice,
        finalAmount: selectedPrice,
        // Preserve gift-related fields if they exist
        ...(existingCartData?.isGift && { isGift: existingCartData.isGift }),
        ...(existingCartData?.giftToken && { giftToken: existingCartData.giftToken }),
        ...(existingCartData?.giftRecipient && { giftRecipient: existingCartData.giftRecipient }),
        ...(existingCartData?.giftGiverName && { giftGiverName: existingCartData.giftGiverName }),
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
      case 6: // Skin concerns details - required
        return formData.allergies.trim() !== '';
      case 7: // Skincare steps - exactly product.stepCount required
        return formData.skincareSteps.length === product.stepCount;
      case 8: // Skincare goals - at least 1 required
        return formData.skincareGoal.length > 0;
      // All remaining steps are optional
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
        return true;
      default:
        return true;
    }
  };

  // Check if the mandatory questions (1-8) are completed
  const isMandatoryCompleted = () => {
    return (
      formData.age !== '' &&
      formData.gender !== '' &&
      formData.skinType !== '' &&
      formData.skinConcerns.length > 0 &&
      formData.complexion !== '' &&
      formData.skincareSteps.length === product.stepCount &&
      formData.skincareGoal.length > 0
    );
  };

  // Check if current step is a single-choice question (auto-advances)
  const isSingleChoiceQuestion = () => {
    // Single-choice questions: 1, 2, 3, 5, 9, 11, 12, 13, 14
    return [1, 2, 3, 5, 9, 11, 12, 13, 14].includes(currentStep);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-black">
              What is your age range?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'].map(
                (age) => (
                  <button
                    key={age}
                    onClick={() => handleInputChange('age', age, true)}
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
            <h2 className="text-xl md:text-2xl font-bold text-black">
              Gender?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Male', 'Female', 'Prefer not to say'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => handleInputChange('gender', gender, true)}
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
            <h2 className="text-xl md:text-2xl font-bold text-black">
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
                  onClick={() => handleInputChange('skinType', type, true)}
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
            <h2 className="text-xl md:text-2xl font-bold text-black">
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
            <h2 className="text-xl md:text-2xl font-bold text-black">
              What is your complexion like?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Light', 'Medium', 'Dark'].map((complexion) => (
                <button
                  key={complexion}
                  onClick={() =>
                    handleInputChange('complexion', complexion, true)
                  }
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
            <h2 className="text-xl md:text-2xl font-bold text-black">
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
            <h2 className="text-xl md:text-2xl font-bold text-black">
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
            <h2 className="text-xl md:text-2xl font-bold text-black">
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
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black">
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
                    handleInputChange(
                      'koreanSkincareExperience',
                      experience,
                      true
                    )
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
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black">
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
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black">
              How many skincare products do you use daily?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['0', '1-2', '3-4', '5 or more'].map((count) => (
                <button
                  key={count}
                  onClick={() =>
                    handleInputChange('dailyProductCount', count, true)
                  }
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
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black">
              Do you follow a regular skincare routine?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Yes, every day', 'Occasionally', 'No'].map((regularity) => (
                <button
                  key={regularity}
                  onClick={() =>
                    handleInputChange('routineRegularity', regularity, true)
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
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black">
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
                    handleInputChange('purchaseLocation', location, true)
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
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black">
              What is your monthly skincare budget?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Under 100 AED', 'AED 100-250', 'AED 250-500', 'AED 500+'].map(
                (budget) => (
                  <button
                    key={budget}
                    onClick={() => handleInputChange('budget', budget, true)}
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
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black">
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

      case 16:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                Optional
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black">
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
            <h1 className="text-2xl md:text-4xl font-bold text-black mb-4">
              Customize Your {product.name}
            </h1>
            <p className="text-sm md:text-base text-black">
              Help us create the perfect skincare routine for you
            </p>
            {/* Show discount badge if applicable */}
            {!isGiftRecipient && hasDiscount(subscriptionParam) && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                <span>
                  {(() => {
                    switch (subscriptionParam) {
                      case '3-months':
                        return `${product.discount3Months}% OFF`;
                      case '6-months':
                        return `${product.discount6Months}% OFF`;
                      default:
                        return `${product.discountOneTime}% OFF`;
                    }
                  })()}
                  {(() => {
                    switch (subscriptionParam) {
                      case '3-months':
                        return product.discountReason3Months ? ` - ${product.discountReason3Months}` : '';
                      case '6-months':
                        return product.discountReason6Months ? ` - ${product.discountReason6Months}` : '';
                      default:
                        return product.discountReasonOneTime ? ` - ${product.discountReasonOneTime}` : '';
                    }
                  })()}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-end justify-between mb-4">
              <span className="text-sm font-medium text-primary">
                Step {currentStep} of 8
              </span>
              <div className="text-right">
                {currentStep <= 8 ? (
                  <span className="text-sm text-black/70">
                    Required: {Math.round((currentStep / 8) * 100)}% Complete
                  </span>
                ) : (
                  <div className="space-y-1">
                    <span className="text-sm text-primary font-medium block">
                      ✓ Required Complete
                    </span>
                    <span className="text-sm text-black/70">
                      Optional: {currentStep - 8}/8
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              {currentStep <= 8 ? (
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 8) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="relative w-full h-2 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-primary w-full h-full" />
                  <motion.div
                    className="absolute inset-0 bg-primary/60 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep - 8) / 8) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8"
          >
            {renderStep()}
          </motion.div>

          {/* Navigation */}
          {currentStep === 8 && isMandatoryCompleted() ? (
            // Special navigation for step 8 - show Add to Cart and optional questions option
            <div className="space-y-6">
              {/* Encourage optional questions */}
              <div className="border border-primary/20 rounded-lg p-6 text-center bg-primary/5">
                <h3 className="text-lg font-semibold text-black mb-2">
                  Essential questions completed!
                </h3>
                <p className="text-black/70 text-sm mb-4">
                  Continue with optional questions for better personalization or
                  add to Cart now.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={nextStep}
                    className="flex bg-white items-center justify-center space-x-2 px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn-primary cursor-pointer flex items-center gap-2 justify-center"
                  >
                    Add to Cart{isGiftRecipient ? '' : ' - '}
                    {!isGiftRecipient && (
                      <>
                        <span className="flex items-center gap-1">
                          <DirhamIcon size={16} className="!text-white" />{' '}
                          {calculatePrice(subscriptionParam).toFixed(2)}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Previous button */}
              <div className="flex justify-start">
                <button
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-black hover:bg-gray-300 rounded-lg font-semibold transition-all cursor-pointer"
                >
                  <ArrowLeft size={20} />
                  <span>Previous</span>
                </button>
              </div>
            </div>
          ) : (
            <>
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

                <div className="flex gap-3">
                  {/* Show "Skip to Cart" for optional questions (steps 9-16) */}
                  {currentStep >= 9 && currentStep < 16 && (
                    <button
                      onClick={handleSubmit}
                      className={`${isSingleChoiceQuestion() ? 'flex' : 'hidden'} md:flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-600 hover:border-primary hover:text-primary rounded-lg font-medium transition-all cursor-pointer`}
                    >
                      <span>Skip to Cart</span>
                    </button>
                  )}

                  {/* Only show Next/Submit buttons for non-single-choice questions */}
                  {!isSingleChoiceQuestion() && (
                    <>
                      {currentStep < 16 ? (
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
                          Add to Cart{' '}
                          {!isGiftRecipient && (
                            <span className="hidden md:flex items-center gap-2">
                              -{' '}
                              <span className="flex items-center gap-1">
                                <DirhamIcon size={16} className="!text-white" />{' '}
                                {calculatePrice(subscriptionParam).toFixed(2)}
                              </span>
                            </span>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              {/* Show "Skip to Cart" for optional questions (steps 9-16) */}
              {currentStep >= 9 && currentStep < 16 && (
                <button
                  onClick={handleSubmit}
                  className={`w-full mt-4 ${isSingleChoiceQuestion() ? 'hidden' : 'flex'}  md:hidden items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-600 hover:border-primary hover:text-primary rounded-lg font-medium transition-all cursor-pointer`}
                >
                  <span className="text-center w-full">Skip to Cart</span>
                </button>
              )}
            </>
          )}
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
