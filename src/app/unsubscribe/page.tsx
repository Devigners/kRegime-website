'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [checking, setChecking] = useState(true);

  // Check subscription status on load
  useEffect(() => {
    if (email) {
      checkSubscriptionStatus();
    } else {
      setChecking(false);
      setError('No email address provided');
    }
  }, [email]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch(
        `/api/unsubscribe?email=${encodeURIComponent(email!)}`
      );
      if (response.ok) {
        const data = await response.json();
        setIsActive(data.isActive);
        if (!data.isActive) {
          setSuccess(true);
        }
      } else {
        setError('Unable to verify subscription status');
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError('Unable to verify subscription status');
    } finally {
      setChecking(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!email) {
      setError('No email address provided');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
        setIsActive(false);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to unsubscribe. Please try again.');
      }
    } catch (err) {
      console.error('Error unsubscribing:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/5 to-transparent rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo-aura.svg"
              alt="KREGIME"
              width={180}
              height={54}
              className="mx-auto"
            />
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-3">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-white">
                Email Preferences
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
                  Successfully Unsubscribed
                </h2>
                <p className="text-base text-neutral-600 mb-6 leading-relaxed">
                  You have been removed from our mailing list. We&apos;re sorry
                  to see you go!
                </p>
                {email && (
                  <p className="text-sm font-medium text-neutral-500 mb-6">
                    {email}
                  </p>
                )}
                <div className="space-y-4">
                  <p className="text-neutral-600">
                    You will no longer receive marketing emails from KREGIME. If
                    you change your mind, you can resubscribe anytime from our
                    website.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex cursor-pointer items-center gap-2 px-8 py-3 bg-primary !text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Return to Home
                  </Link>
                </div>
              </motion.div>
            ) : error && !email ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
                  Invalid Link
                </h2>
                <p className="text-base text-neutral-600 mb-6 leading-relaxed">
                  This unsubscribe link is invalid or incomplete. Please use the
                  unsubscribe link from one of our emails.
                </p>
                <Link
                  href="/"
                  className="inline-flex cursor-pointer items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Return to Home
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-2">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
                    {isActive
                      ? 'Unsubscribe from Our Newsletter'
                      : 'Already Unsubscribed'}
                  </h2>
                  <p className="text-base text-neutral-600 leading-relaxed">
                    {isActive
                      ? "We're sorry to see you go. Click the button below to unsubscribe from our mailing list."
                      : 'You have already unsubscribed from our mailing list.'}
                  </p>
                </div>

                {email && (
                  <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      Email Address
                    </p>
                    <p className="text-base font-medium text-neutral-900 break-all">
                      {email}
                    </p>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                  >
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 font-medium">{error}</p>
                  </motion.div>
                )}

                <div className="space-y-4 pt-6">
                  {isActive ? (
                    <>
                      <button
                        onClick={handleUnsubscribe}
                        disabled={loading}
                        className="cursor-pointer w-full px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Unsubscribing...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5" />
                            Unsubscribe
                          </>
                        )}
                      </button>
                      <p className="text-sm text-neutral-500 text-center">
                        You can resubscribe anytime from our website
                      </p>
                    </>
                  ) : (
                    <Link
                      href="/"
                      className="block w-full px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center"
                    >
                      Return to Home
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-neutral-600">
            © 2024 KREGIME. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Link
              href="/privacy"
              className="text-sm text-neutral-600 hover:text-primary transition-colors font-medium"
            >
              Privacy Policy
            </Link>
            <span className="text-neutral-400">•</span>
            <Link
              href="/terms"
              className="text-sm text-neutral-600 hover:text-primary transition-colors font-medium"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
