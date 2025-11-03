'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, Check, X, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DirhamIcon from '@/components/icons/DirhamIcon';
import { calculatePrice } from '@/lib/pricing';

interface GiftData {
  orderId: string;
  giftGiverName: string;
  giftGiverEmail: string;
  giftClaimed: boolean;
  giftClaimedAt: string | null;
  subscriptionType: 'one-time' | '3-months' | '6-months';
  regime: {
    id: string;
    name: string;
    description: string;
    images: string[];
    steps: string[];
    stepCount: number;
    priceOneTime: number;
    price3Months: number;
    price6Months: number;
    discountOneTime?: number;
    discount3Months?: number;
    discount6Months?: number;
    discountReasonOneTime?: string | null;
    discountReason3Months?: string | null;
    discountReason6Months?: string | null;
  };
}

export default function GiftRedemptionPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchGiftData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchGiftData = async () => {
    try {
      const response = await fetch(`/api/gifts/${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load gift');
        return;
      }

      setGiftData(data);
    } catch (err) {
      console.error('Error fetching gift:', err);
      setError('Failed to load gift');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimGift = async () => {
    if (!giftData) return;

    try {
      // Save gift data to localStorage cart
      const giftCartData = {
        regimeId: giftData.regime.id,
        regime: {
          id: giftData.regime.id,
          name: giftData.regime.name,
          description: giftData.regime.description,
          images: giftData.regime.images,
          steps: giftData.regime.steps,
          stepCount: giftData.regime.stepCount,
          priceOneTime: giftData.regime.priceOneTime,
          price3Months: giftData.regime.price3Months,
          price6Months: giftData.regime.price6Months,
        },
        quantity: 1,
        subscriptionType: giftData.subscriptionType,
        totalAmount: 0, // Gift is already paid
        finalAmount: 0, // Gift is already paid
        isGift: true,
        giftToken: token,
        giftRecipient: true, // Flag to indicate this user is the recipient
      };

      localStorage.setItem('kregime_cart', JSON.stringify(giftCartData));
      
      // Navigate to regime form
      router.push('/regime-form');
    } catch (error) {
      console.error('Error claiming gift:', error);
    }
  };

  if (loading) {
    return (
      <div className="container section-padding py-40 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your gift...</p>
      </div>
    );
  }

  if (error || !giftData) {
    return (
      <div className="container section-padding py-40 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-4">Gift Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || 'This gift link is invalid or has expired.'}
          </p>
          <Link href="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (giftData.giftClaimed) {
    return (
      <div className="container section-padding py-40 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-4">Gift Already Claimed</h1>
          <p className="text-gray-600 mb-2">
            This gift has already been claimed on{' '}
            {giftData.giftClaimedAt && new Date(giftData.giftClaimedAt).toLocaleDateString()}.
          </p>
          <p className="text-gray-600 mb-8">
            If you believe this is an error, please contact support.
          </p>
          <Link href="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Create a properly typed product object for calculatePrice
  const productForPricing = {
    id: giftData.regime.id,
    name: giftData.regime.name,
    description: giftData.regime.description,
    steps: giftData.regime.steps,
    images: giftData.regime.images,
    stepCount: giftData.regime.stepCount as 3 | 5 | 7,
    priceOneTime: giftData.regime.priceOneTime,
    price3Months: giftData.regime.price3Months,
    price6Months: giftData.regime.price6Months,
    discountOneTime: giftData.regime.discountOneTime,
    discount3Months: giftData.regime.discount3Months,
    discount6Months: giftData.regime.discount6Months,
    discountReasonOneTime: giftData.regime.discountReasonOneTime,
    discountReason3Months: giftData.regime.discountReason3Months,
    discountReason6Months: giftData.regime.discountReason6Months,
  };

  const priceInfo = calculatePrice(productForPricing, giftData.subscriptionType);

  return (
    <div className="container section-padding py-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Gift className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            You&apos;ve Received a Gift! 🎁
          </h1>
          
          <p className="text-xl text-gray-700">
            From <span className="font-semibold text-primary">{giftData.giftGiverName}</span>
          </p>
        </div>

        {/* Gift Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2 bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 relative h-64 md:h-auto">
              {giftData.regime.images && giftData.regime.images.length > 0 ? (
                <Image
                  src={giftData.regime.images[0]}
                  alt={giftData.regime.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-primary" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold text-black mb-3">
                {giftData.regime.name}
              </h2>
              
              <p className="text-gray-700 mb-6">
                {giftData.regime.description}
              </p>

              {/* Subscription Type Badge */}
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {giftData.subscriptionType === 'one-time' && 'One-Time Purchase'}
                {giftData.subscriptionType === '3-months' && '3-Month Subscription'}
                {giftData.subscriptionType === '6-months' && '6-Month Subscription'}
              </div>

              {/* Steps */}
              <div className="mb-6">
                <h3 className="font-semibold text-black mb-3 flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Included Steps ({giftData.regime.stepCount}):
                </h3>
                <div className="space-y-2">
                  {giftData.regime.steps.map((step, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Value */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Gift Value:</span>
                  <div className="flex items-center gap-2">
                    {priceInfo.hasDiscount && (
                      <span className="text-gray-500 line-through flex items-center gap-1">
                        <DirhamIcon size={12} className="text-gray-500" />
                        {priceInfo.originalPrice}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary flex items-center gap-1">
                      <DirhamIcon size={16} className="text-primary" />
                      {priceInfo.discountedPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-black mb-3">What happens next?</h3>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="font-bold text-primary mr-3">1.</span>
              <span>Complete a quick skincare questionnaire to customize your regime</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary mr-3">2.</span>
              <span>Provide your shipping address for delivery</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-primary mr-3">3.</span>
              <span>Receive your personalized skincare routine (already paid for!)</span>
            </li>
          </ol>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleClaimGift}
            className="btn-primary text-lg px-12 py-4 inline-flex items-center gap-3"
          >
            <Gift className="w-6 h-6" />
            Claim Your Gift
          </button>
          
          <p className="text-sm text-gray-600 mt-4">
            This will take you to a personalization form
          </p>
        </div>
      </motion.div>
    </div>
  );
}
