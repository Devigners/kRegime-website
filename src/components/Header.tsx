'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { localStorage as localStorageUtils } from '@/lib/localStorage';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cartData = localStorageUtils.getCartData();
      setCartCount(cartData?.quantity || 0);
    };

    // Initial load
    updateCartCount();

    // Listen for storage changes (when cart is updated in other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kregime_cart') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event listener for same-tab cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col ${
        isScrolled || isMenuOpen
          ? 'bg-white glass shadow-soft'
          : 'bg-transparent'
      } ${isMenuOpen ? 'h-screen' : 'h-fit'}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="container section-padding">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-36 h-36 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.svg"
                alt="Kregime Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            {[
              { href: '/', label: 'Home' },
              { href: '/#brands', label: 'Brands' },
              { href: '/#how-it-works', label: 'How It Works' },
              { href: '/#reviews', label: 'Reviews' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-lg font-medium transition-all duration-300 group ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-neutral-700 hover:text-primary'
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA and Cart */}
          <div className="flex items-center space-x-6">
            <Link
              href="/cart"
              className="relative p-3 text-neutral-700 hover:text-primary transition-all duration-300 group"
            >
              <div>
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-secondary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <div className="hidden md:block">
              <Link href="/#regimes" className="btn-primary text-sm">
                FIND YOUR REGIME
              </Link>
            </div>

            {/* Mobile menu button */}
            <motion.button
              className="lg:hidden relative p-3 text-neutral-700 hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden z-40 h-full"
            initial={{ opacity: 0, y: -20, backgroundColor: 'transparent' }}
            animate={{ opacity: 1, y: 0, backgroundColor: 'white' }}
            exit={{ opacity: 0, y: -20, backgroundColor: 'transparent' }}
            transition={{ duration: 0.3 }}
          >
            <div className="container section-padding h-full">
              <div className="py-8">
                <nav className="flex flex-col space-y-6">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/#brands', label: 'Brands' },
                    { href: '/#regimes', label: 'Regimes' },
                    { href: '/#how-it-works', label: 'How It Works' },
                    { href: '/#reviews', label: 'Reviews' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="text-lg font-medium text-neutral-700 hover:text-primary transition-colors duration-300 block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="pt-4"
                  >
                    <Link
                      href="/#regimes"
                      className="btn-primary w-full text-center block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
