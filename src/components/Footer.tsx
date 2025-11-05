'use client';
import { motion } from 'framer-motion';
import {
  Heart,
  Instagram,
  Mail,
  Youtube,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'footer'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-r from-primary to-primary-light text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container section-padding py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-36 h-fit flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo.svg"
                    alt="KREGIME Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                </div>
              </div>
              <p className="text-white leading-relaxed max-w-md">
                Discover your perfect skincare routine with our expertly curated regime boxes featuring premium Korean products
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, href: 'https://instagram.com/kregime.official/', label: 'Instagram' },
                  { icon: Youtube, href: 'https://www.youtube.com/@kregime', label: 'Youtube' },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target='_blank'
                    className="w-12 h-12 bg-white backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-primary/20 transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { label: 'Our Products', href: '/#regimes' },
                  { label: 'How It Works', href: '/#how-it-works' },
                  { label: 'Customer Reviews', href: '/#reviews' },
                  { label: 'Skincare Quiz', href: '/regime-form' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-neutral-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Support Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold">Support</h3>
              <div className="space-y-4">
                <p className="text-white text-sm leading-relaxed">
                  Have questions? We&apos;re here to help you on your skincare
                  journey.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-white" />
                    <a
                      href="mailto:care@kregime.com"
                      className="text-primary hover:text-primary-light transition-colors duration-300"
                    >
                      care@kregime.com
                    </a>
                  </div>
                  <p className="text-white text-sm">Response within 24 hours</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          className="border-t border-black/10 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="container section-padding py-12">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-semibold">
                Join the Glow Community
              </h3>
              <p className="text-white max-w-lg mx-auto">
                Get exclusive skincare tips, early access to new products, and
                special offers delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 w-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-4 bg-black/10 backdrop-blur-sm border border-black/10 rounded-lg text-white placeholder-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-secondary !bg-white hover:!text-primary px-8 py-4 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="border-t border-white/10">
          <div className="container section-padding py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-white text-sm">
                <span>© 2025 KREGIME. Made with</span>
                <Heart className="w-4 h-4 text-white fill-current" />
                <span>for your skin</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
                <div className="flex space-x-6">
                  <Link
                    href="/privacy"
                    className="text-white hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-white hover:text-white transition-colors duration-300"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
