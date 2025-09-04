'use client';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  Facebook,
  Heart,
  Instagram,
  Mail,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
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
                <div className="w-40 h-fit flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo.svg"
                    alt="Kregime Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                </div>
              </div>
              <p className="text-neutral-300 leading-relaxed max-w-md">
                AI-Curated Korean Skincare Regimes Simplified. Discover your
                perfect skincare routine with our expertly curated regime boxes
                featuring premium Korean products.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Facebook, href: '#', label: 'Facebook' },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-primary/20 transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors duration-300" />
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
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Have questions? We&apos;re here to help you on your skincare
                  journey.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <a
                      href="mailto:care@kregime.com"
                      className="text-primary hover:text-primary-light transition-colors duration-300"
                    >
                      care@kregime.com
                    </a>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          className="border-t border-white/10 bg-white/5 backdrop-blur-sm"
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
              <p className="text-neutral-300 max-w-2xl mx-auto">
                Get exclusive skincare tips, early access to new products, and
                special offers delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                />
                <button className="btn-primary px-8 py-4 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="border-t border-white/10">
          <div className="container section-padding py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-neutral-400 text-sm">
                <span>© 2025 Kregime. Made with</span>
                <Heart className="w-4 h-4 text-primary fill-current" />
                <span>for your skin</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
                <div className="flex space-x-6">
                  <Link
                    href="/privacy"
                    className="text-neutral-400 hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-neutral-400 hover:text-white transition-colors duration-300"
                  >
                    Terms of Service
                  </Link>
                </div>

                <motion.button
                  onClick={scrollToTop}
                  className="flex items-center space-x-2 text-neutral-400 hover:text-primary transition-colors duration-300 group"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
                  <span>Back to top</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
