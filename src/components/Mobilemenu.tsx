"use client"
import { X } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg md:hidden z-50"
          >
            <div className="p-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-6 h-6" />
              </button>

              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  href="/games"
                  className="px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={onClose}
                >
                  Games
                </Link>
                <Link
                  href="/pricing"
                  className="px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={onClose}
                >
                  Pricing
                </Link>
                <Link
                  href="/rules"
                  className="px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={onClose}
                >
                  Rules
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={onClose}
                >
                  About
                </Link>

                <div className="mt-4 flex flex-col gap-2 px-4">
                  <Button variant="outline" className="w-full" onClick={onClose}>
                    Login
                  </Button>
                  <Button className="w-full" onClick={onClose}>
                    Sign Up
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;