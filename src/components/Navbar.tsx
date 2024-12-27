"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import MobileMenu from './Mobilemenu';
import { useScrollEffect } from '@/hooks/useScrollEffect';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isScrolled = useScrollEffect();

  return (
    <nav className={`${
      isScrolled ? 'bg-gray-200' : 'bg-transparent'
    } sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className={`${
            isScrolled ? 'text-black' : 'text-white'
          } text-xl font-bold transition-colors duration-300`}>
            Logo
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className={`${
              isScrolled ? 'text-black' : 'text-white'
            } flex gap-6 items-center transition-colors duration-300`}>
              <Link href="/games" className="hover:opacity-80">Games</Link>
              <Link href="/pricing" className="hover:opacity-80">Pricing</Link>
              <Link href="/rules" className="hover:opacity-80">Rules</Link>
              <Link href="/about" className="hover:opacity-80">About</Link>
            </div>
            
            <div className="flex gap-2">
              <Link href={'/login'}>
              <Button variant="outline">Login</Button>
              </Link>
              <Link href={'/login'}>
              <Button>Sign Up</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-black' : 'text-white'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;