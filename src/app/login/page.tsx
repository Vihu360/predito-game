"use client"
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to continue your journey</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 font-medium relative"
              onClick={() => signIn('google', { callbackUrl: '/games' })}
            >
              <Image
                src="https://www.google.com/favicon.ico"
                alt="Google"
                width={20}
                height={20}
                className="absolute left-4"
              />
              Continue with Google
            </Button>

            {/* <Button 
              variant="outline"
              className="w-full h-12 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-medium relative"
              onClick={() => {}} // Will be handled by NextAuth
            >
              <Github className="absolute left-4 w-5 h-5" />
              Continue with GitHub
            </Button> */}
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign up
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-400">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-gray-400">
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}