'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Mail, Package, Truck, Clock, ShoppingBag, X, CheckCircle2, Copy } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { orderApi, regimeApi } from '@/lib/api';
import { Order, Regime } from '@/models/database';
import Image from 'next/image';
import DirhamIcon from '@/components/icons/DirhamIcon';
import { toast } from 'sonner';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [regime, setRegime] = useState<Regime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [giftLinkCopied, setGiftLinkCopied] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const getSubscriptionTypeDisplay = (subscriptionType: 'one-time' | '3-months' | '6-months') => {
    switch (subscriptionType) {
      case 'one-time':
        return 'One-time Purchase';
      case '3-months':
        return '3-Month Subscription Paid Monthly';
      case '6-months':
        return '6-Month Subscription Paid Monthly';
      default:
        return 'One-time Purchase';
    }
  };

  const copyConfirmationLink = async () => {
    const url = `${window.location.origin}/confirmation?orderId=${orderId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Confirmation link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  const copyGiftLink = async () => {
    if (!order?.giftToken) {
      toast.error('Gift token not available');
      return;
    }
    const url = `${window.location.origin}/gift/${order.giftToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setGiftLinkCopied(true);
      toast.success('Gift link copied to clipboard!');
      setTimeout(() => setGiftLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleSendGiftEmail = async () => {
    if (!recipientEmail || !recipientName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!order?.giftToken) {
      toast.error('Gift token not available');
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch('/api/gifts/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftToken: order.giftToken,
          recipientEmail,
          recipientName,
          giftMessage,
          senderName: order.shippingAddress?.firstName || 'A friend',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send gift email');
      }

      toast.success('Gift email sent successfully!');
      setShowEmailModal(false);
      setRecipientEmail('');
      setRecipientName('');
      setGiftMessage('');
    } catch (error) {
      console.error('Error sending gift email:', error);
      toast.error('Failed to send gift email');
    } finally {
      setSendingEmail(false);
    }
  };

  const shareOnWhatsApp = () => {
    const url = `${window.location.origin}/confirmation?orderId=${orderId}`;
    const text = `Check out my KREGIME order! Order #${orderId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const shareGiftOnWhatsApp = () => {
    if (!order?.giftToken) {
      toast.error('Gift token not available');
      return;
    }
    const url = `${window.location.origin}/gift/${order.giftToken}`;
    const text = `Hey, I've got a special gift for you! Enjoy a personalized Korean skincare regime from KREGIME. Click the link to claim your gift:`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  const getOrderStatusConfig = (status: Order['status'], isGift?: boolean, giftClaimed?: boolean) => {
    // For gift orders, show different messaging based on claim status
    if (isGift && !giftClaimed) {
      return {
        icon: Clock,
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        bgGradient: 'from-purple-50 to-purple-100',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        label: 'Gift Awaiting Redemption',
        description: 'Your gift has been purchased and is ready to be redeemed by your loved ones.',
        nextSteps: 'Share the gift link with your loved one so they can claim their personalized skincare regime.'
      };
    }
    
    if (isGift && giftClaimed) {
      // Show the normal status for claimed gifts
      switch (status) {
        case 'pending':
          return {
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            bgGradient: 'from-yellow-50 to-yellow-100',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            label: 'Gift Redeemed - Order Received',
            description: 'Your gift has been redeemed and the order is awaiting confirmation.',
            nextSteps: 'We will confirm the order and begin processing within 24 hours.'
          };
        case 'processing':
          return {
            icon: Package,
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            bgGradient: 'from-blue-50 to-blue-100',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            label: 'Gift Redeemed - Order Processing',
            description: 'The personalized skincare regime is being curated for your recipient.',
            nextSteps: 'The order will be packed and shipped within 1-2 business days.'
          };
        case 'shipped':
          return {
            icon: Truck,
            color: 'bg-purple-100 text-purple-800 border-purple-200',
            bgGradient: 'from-purple-50 to-purple-100',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            label: 'Gift Redeemed - Order Shipped',
            description: 'Your gift is on its way to the recipient!',
            nextSteps: 'The order will be delivered within 2-3 business days.'
          };
        case 'completed':
          return {
            icon: CheckCircle2,
            color: 'bg-green-100 text-green-800 border-green-200',
            bgGradient: 'from-green-50 to-green-100',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            label: 'Gift Redeemed - Order Delivered',
            description: 'Your gift has been successfully delivered to the recipient!',
            nextSteps: 'Your gift has brought joy and beautiful skin to your loved one!'
          };
        case 'cancelled':
          return {
            icon: X,
            color: 'bg-red-100 text-red-800 border-red-200',
            bgGradient: 'from-red-50 to-red-100',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            label: 'Order Cancelled',
            description: 'This order has been cancelled.',
            nextSteps: 'If you have any questions, please contact our support team.'
          };
        default:
          return {
            icon: ShoppingBag,
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            bgGradient: 'from-gray-50 to-gray-100',
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600',
            label: 'Order Status Unknown',
            description: 'Unable to determine order status.',
            nextSteps: 'Please contact support for assistance.'
          };
      }
    }
    
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          bgGradient: 'from-yellow-50 to-yellow-100',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          label: 'Order Received',
          description: 'Your order has been received and is awaiting confirmation.',
          nextSteps: 'We will confirm your order and begin processing within 24 hours.'
        };
      case 'processing':
        return {
          icon: Package,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          bgGradient: 'from-blue-50 to-blue-100',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          label: 'Order Processing',
          description: 'Your personalized skincare regime is being curated by our experts.',
          nextSteps: 'Your order will be packed and shipped within 1-2 business days.'
        };
      case 'shipped':
        return {
          icon: Truck,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          bgGradient: 'from-purple-50 to-purple-100',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          label: 'Order Shipped',
          description: 'Your Korean skincare regime is on its way to you!',
          nextSteps: 'Your order will be delivered within 2-3 business days.'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          color: 'bg-green-100 text-green-800 border-green-200',
          bgGradient: 'from-green-50 to-green-100',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          label: 'Order Delivered',
          description: 'Your Korean skincare regime has been successfully delivered!',
          nextSteps: 'Enjoy your personalized skincare journey. Don\'t forget to leave a review!'
        };
      case 'cancelled':
        return {
          icon: X,
          color: 'bg-red-100 text-red-800 border-red-200',
          bgGradient: 'from-red-50 to-red-100',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          label: 'Order Cancelled',
          description: 'This order has been cancelled.',
          nextSteps: 'If you have any questions, please contact our support team.'
        };
      default:
        return {
          icon: ShoppingBag,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          bgGradient: 'from-gray-50 to-gray-100',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          label: 'Order Status Unknown',
          description: 'Unable to determine order status.',
          nextSteps: 'Please contact support for assistance.'
        };
    }
  };

  useEffect(() => {
    const fetchOrderAndRegime = async () => {
      if (!orderId) {
        console.log('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching order:', orderId);
        const orderData = await orderApi.getById(orderId);
        console.log('Order data received:', orderData);
        setOrder(orderData);

        // Fetch regime data
        if (orderData.regimeId) {
          console.log('Fetching regime:', orderData.regimeId);
          const regimeData = await regimeApi.getById(orderData.regimeId);
          console.log('Regime data received:', regimeData);
          setRegime(regimeData);
        }
      } catch (err) {
        console.error('Error fetching order/regime:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndRegime();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-40">
        <div className="container section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-black">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-40">
        <div className="container section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-black mb-2">
              Thank you for your purchase. Your Korean skincare journey begins
              now!
            </p>
            <p className="text-red-600 text-sm mb-8">
              {error} - but your order has been processed successfully.
            </p>
            <Link href="/" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-40">
      <div className="container section-padding">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-sm mx-auto mb-6 ${
              order?.status === 'cancelled' 
                ? 'bg-red-100' 
                : order?.status === 'completed' 
                ? 'bg-white' 
                : order?.status === 'shipped'
                ? 'bg-white'
                : order?.status === 'processing'
                ? 'bg-white'
                : order?.status === 'pending'
                ? 'bg-white'
                : 'bg-white'
            }`}>
              {order?.status === 'cancelled' ? (
                <X size={40} className="text-red-500" />
              ) : order?.status === 'completed' ? (
                <CheckCircle2 size={40} className="text-primary" />
              ) : order?.status === 'shipped' ? (
                <Truck size={40} className="text-primary" />
              ) : order?.status === 'processing' ? (
                <Package size={40} className="text-primary" />
              ) : order?.status === 'pending' ? (
                <Clock size={40} className="text-primary" />
              ) : (
                <CheckCircle size={40} className="text-primary" />
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                {order ? getOrderStatusConfig(order.status).label : 'Order Received!'}
            </h1>
            <p className="text-lg text-black mb-2">
              {order?.isGift ? 'Thank you for your purchase. You can now share the link with your loved one!' : order?.status === 'cancelled' 
                ? 'This order has been cancelled. If you have any questions, please contact support.'
                : order?.status === 'completed' 
                ? 'Your Korean skincare regime has been delivered. Enjoy your skincare journey!'
                : 'Thank you for your purchase. Your Korean skincare journey begins now!'}
            </p>
            <p className="text-primary font-semibold">
              Order #{order?.id || 'Processing...'}
            </p>

            {/* Quick Action Buttons - Show for non-gift orders OR claimed gifts */}
            {(!order?.isGift || order?.giftClaimed) && (
              <div className="flex items-center justify-center gap-3 mt-6">
                {/* Copy Link */}
                <button
                  onClick={copyConfirmationLink}
                  className="flex cursor-pointer items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors shadow-sm hover:shadow-md"
                  title="Copy confirmation link"
                >
                  {copied ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>

                {/* WhatsApp */}
                <button
                  onClick={shareOnWhatsApp}
                  className="flex cursor-pointer items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-sm hover:shadow-md"
                  title="Share on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>

                {/* Track Parcel - Only show for shipped orders with tracking number */}
                {order && order.status === 'shipped' && order.trackingNumber && (
                  <button
                    onClick={() => window.open(`https://myjeebly.jeebly.com/shipment-tracking/?uae=uae&service_type=Scheduled&awb=${order.trackingNumber}`, '_blank')}
                    className="flex cursor-pointer items-center justify-center w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors shadow-sm hover:shadow-md"
                    title="Track your parcel"
                  >
                    <Truck size={20} />
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Gift Sharing Section - Only show for unclaimed gift orders */}
          {order && order.isGift && !order.giftClaimed && order.giftToken && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-3">
                  {/* Copy Gift Link */}
                  <button
                    onClick={copyGiftLink}
                    className="flex cursor-pointer items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors shadow-sm hover:shadow-md"
                    title="Copy gift link"
                  >
                    {giftLinkCopied ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={shareGiftOnWhatsApp}
                    className="flex cursor-pointer items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-sm hover:shadow-md"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="flex cursor-pointer items-center justify-center w-12 h-12 bg-primary/80 hover:bg-primary text-white rounded-full transition-colors shadow-sm hover:shadow-md"
                    title="Send via email"
                  >
                    <Mail size={20} />
                  </button>
                </div>
            </motion.div>
          )}

          {/* Order Status Display */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: order.isGift ? 0.2 : 0.1 }}
              className="mb-8"
            >
              {(() => {
                const statusConfig = getOrderStatusConfig(order.status, order.isGift, order.giftClaimed);
                
                return (
                  <div className={`relative overflow-hidden rounded-xl border-2 bg-white border-primary p-6`}>
                    <div className="flex flex-col gap-4 items-center justify-between">
                      <div className="w-full flex flex-col items-start gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            {statusConfig.label}
                          </h2>
                          <p className="text-gray-700 mt-1">
                            {statusConfig.description}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 font-medium">
                            {statusConfig.nextSteps}
                          </p>
                        </div>
                      </div>
                      <div className="w-full text-left">
                        <p className="text-sm text-gray-600">Last updated</p>
                        <p className="text-sm font-semibold text-nowrap text-gray-800">
                          {new Date(order.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-black mb-6">
              Order Details
            </h2>

            {order && regime ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {regime.images && regime.images.length > 0 ? (
                      <Image
                        src={regime.images[0]}
                        alt={regime.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 flex items-center justify-center">
                        <span className="text-xs text-neutral-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">{regime.name} - {regime.stepCount} steps routine</h3>
                    <p className="text-sm text-black">{regime.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-black">
                        {getSubscriptionTypeDisplay(order.subscriptionType || 'one-time')}
                      </span>
                      <span className="font-semibold text-black flex items-center gap-1">
                        <DirhamIcon size={12} className="text-black" />
                        {order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personalized Regime Steps - Only show for non-gift orders or claimed gifts */}
                {(!order.isGift || order.giftClaimed) && order.userDetails?.skincareSteps && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-black mb-3">
                      Your Personalized Regime Steps
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {order.userDetails?.skincareSteps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-black font-medium capitalize">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : order && !regime ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-black text-xs">Regime</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">
                      {order.regimeId.toUpperCase()}
                    </h3>
                    <p className="text-sm text-black">
                      Korean skincare routine
                    </p>
                    <p className="text-sm text-black mt-1">
                      Customized for {order.userDetails?.skinType} skin
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-black">
                        {getSubscriptionTypeDisplay(order.subscriptionType || 'one-time')}
                      </span>
                      <span className="font-semibold text-black flex items-center gap-1">
                        <DirhamIcon size={12} className="text-black" />
                        {order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">Subtotal</span>
                    <span className="text-black flex items-center gap-1">
                      <DirhamIcon size={12} className="text-black" />
                      {order.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Shipping</span>
                    <span className="text-black">Free</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-black">Total</span>
                      <span className="text-black flex items-center gap-1">
                        <DirhamIcon size={14} className="text-black" />
                        {order.finalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personalized Regime Steps - Only show for non-gift orders or claimed gifts */}
                {(!order.isGift || order.giftClaimed) && order.userDetails?.skincareSteps && order.userDetails.skincareSteps.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-black mb-3">
                      Your Personalized Regime Steps
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {order.userDetails.skincareSteps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-black font-medium capitalize">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-black text-xs">Product</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">
                      Processing Order...
                    </h3>
                    <p className="text-sm text-black">
                      Your order is being processed
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-black mb-6">
              What&apos;s Next?
            </h2>

            {/* For gift orders that haven't been claimed yet */}
            {order?.isGift && !order?.giftClaimed ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 aspect-square rounded-full flex items-center justify-center bg-purple-100">
                    <CheckCircle size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">
                      Gift Purchased ✓
                    </h3>
                    <p className="text-black text-sm">
                      You&apos;ve successfully purchased a personalized skincare regime as a gift!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 aspect-square rounded-full flex items-center justify-center bg-primary/10">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Share the Gift</h3>
                    <p className="text-black text-sm">
                      Use the share options above to send the gift link to your recipient. They&apos;ll need to complete their skincare profile and provide their shipping address.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 aspect-square rounded-full flex items-center justify-center bg-gray-100">
                    <Clock size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-400">Awaiting Redemption</h3>
                    <p className="text-gray-400 text-sm">
                      Once your recipient claims the gift, the order will be processed and shipped to their address.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Order Progress Timeline - Always show all statuses */}
                <div className="space-y-4">
                  {/* Pending Status */}
                  <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 aspect-square rounded-full flex items-center justify-center ${
                    order?.status === 'pending' 
                      ? 'bg-primary/10' 
                      : ['processing', 'shipped', 'completed'].includes(order?.status || '')
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {order?.status === 'pending' ? (
                      <Clock size={20} className="text-primary" />
                    ) : ['processing', 'shipped', 'completed'].includes(order?.status || '') ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <Clock size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      order?.status === 'pending' 
                        ? 'text-black' 
                        : ['processing', 'shipped', 'completed'].includes(order?.status || '')
                        ? 'text-black'
                        : 'text-gray-400'
                    }`}>
                      {order?.status === 'pending' ? 'Order Confirmation' : 'Order Confirmed'}
                      {['processing', 'shipped', 'completed'].includes(order?.status || '') ? ' ✓' : ''}
                    </h3>
                    <p className={`text-sm ${
                      order?.status === 'pending' 
                        ? 'text-black' 
                        : ['processing', 'shipped', 'completed'].includes(order?.status || '')
                        ? 'text-black'
                        : 'text-gray-400'
                    }`}>
                      {order?.status === 'pending' 
                        ? "We'll review and confirm your order within 24 hours."
                        : "Your order has been confirmed and verified."}
                    </p>
                  </div>
                </div>

                {/* Processing Status */}
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 aspect-square rounded-full flex items-center justify-center ${
                    order?.status === 'processing' 
                      ? 'bg-primary/10' 
                      : ['shipped', 'completed'].includes(order?.status || '')
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {order?.status === 'processing' ? (
                      <Package size={20} className="text-primary" />
                    ) : ['shipped', 'completed'].includes(order?.status || '') ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <Package size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      order?.status === 'processing' 
                        ? 'text-black' 
                        : ['shipped', 'completed'].includes(order?.status || '')
                        ? 'text-black'
                        : 'text-gray-400'
                    }`}>
                      {order?.status === 'processing' ? 'Order Processing' : 'Order Processed'}
                      {['shipped', 'completed'].includes(order?.status || '') ? ' ✓' : ''}
                    </h3>
                    <p className={`text-sm ${
                      order?.status === 'processing' 
                        ? 'text-black' 
                        : ['shipped', 'completed'].includes(order?.status || '')
                        ? 'text-black'
                        : 'text-gray-400'
                    }`}>
                      {order?.status === 'processing' 
                        ? "Our skincare experts are curating your personalized regime right now."
                        : "Your personalized regime has been curated and packed."}
                    </p>
                  </div>
                </div>

                {/* Shipped Status */}
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 aspect-square rounded-full flex items-center justify-center ${
                    order?.status === 'shipped' 
                      ? 'bg-primary/10' 
                      : order?.status === 'completed'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {order?.status === 'shipped' ? (
                      <Truck size={20} className="text-primary" />
                    ) : order?.status === 'completed' ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <Truck size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      order?.status === 'shipped' 
                        ? 'text-black' 
                        : order?.status === 'completed'
                        ? 'text-black'
                        : 'text-gray-400'
                    }`}>
                      {order?.status === 'shipped' ? 'Order Shipped' : 'Shipping & Delivery'}
                      {order?.status === 'completed' ? ' ✓' : ''}
                    </h3>
                    <p className={`text-sm ${
                      order?.status === 'shipped' 
                        ? 'text-black' 
                        : order?.status === 'completed'
                        ? 'text-black'
                        : 'text-gray-400'
                    }`}>
                      {order?.status === 'shipped' 
                        ? "Your Korean skincare regime is on its way to you!"
                        : order?.status === 'completed'
                        ? "Your order was successfully delivered."
                        : "Your order will be shipped within 1-2 business days."}
                    </p>
                  </div>
                </div>

                {/* Completed Status */}
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 aspect-square rounded-full flex items-center justify-center ${
                    order?.status === 'completed' 
                      ? 'bg-primary/10' 
                      : 'bg-gray-100'
                  }`}>
                    {order?.status === 'completed' ? (
                      <CheckCircle size={20} className="text-primary" />
                    ) : (
                      <CheckCircle size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      order?.status === 'completed' 
                        ? 'text-black' 
                        : 'text-gray-400'
                    }`}>
                      Order Delivered
                      {order?.status === 'completed' ? ' ✓' : ''}
                    </h3>
                    <p className={`text-sm ${
                      order?.status === 'completed' 
                        ? 'text-black' 
                        : 'text-gray-400'
                    }`}>
                      {order?.status === 'completed' 
                        ? "Your Korean skincare regime has been successfully delivered! Enjoy your skincare journey."
                        : "Your Korean skincare regime will be delivered within 2-3 business days."}
                    </p>
                  </div>
                  </div>
                </div>

                {/* Cancelled Status - Only show if order is cancelled */}
                {order?.status === 'cancelled' && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 aspect-square bg-red-100 rounded-full flex items-center justify-center">
                      <X size={20} className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">Order Cancelled</h3>
                      <p className="text-black text-sm mb-3">
                        This order has been cancelled.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                            <Mail size={12} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-black text-sm">Refund Processing</h4>
                            <p className="text-black text-xs">
                              If you were charged, your refund will be processed within 5-7 business days.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                            <Package size={12} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-black text-sm">Need Help?</h4>
                            <p className="text-black text-xs">
                              Contact our support team if you have any questions about the cancellation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Continue Shopping Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-4"
          >
            <Link href="/" className="btn-primary inline-block">
              Continue Shopping
            </Link>
            <p className="text-black">
              Questions about your order?{' '}
              <a
                href="mailto:care@kregime.com"
                className="text-primary hover:text-primary-dark"
              >
                Contact our support team
              </a>
            </p>
          </motion.div>
        </div>

        {/* Email Gift Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Send Gift via Email</h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recipient&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient's name"
                    className="focus:outline-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recipient&apos;s Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient's email"
                    className="focus:outline-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Add a personal message to your gift..."
                    rows={4}
                    className="focus:outline-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendGiftEmail}
                    disabled={sendingEmail || !recipientEmail || !recipientName}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sendingEmail ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail size={18} />
                        Send Gift
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Confirmation() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-40">
          <div className="container section-padding">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-black">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
