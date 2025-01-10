"use client"
import { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { UserProps } from '@/lib/type';



const SharePage = ( ) => {
  const [copied, setCopied] = useState(false);

  const { data: session, status } = useSession();

  if (status === 'loading') return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black ">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
  </div>
  );

    const userId = (session?.user as UserProps)?.id;

    const referralCode = userId ? userId.slice(0, 6).toUpperCase() : '';

    const referralUrl = `${window.location.origin}/signup?ref=${referralCode}`; 


  const handleCopy = async () => {
    try {
        console.log('referralUrl', referralUrl)
        console.log('referralCode', referralCode)
        console.log("copied",copied);
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Join me using my referral code: ${referralCode}\n${referralUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="flex items-center justify-center h-full w-full">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700 max-w-md w-full">
        <div className="text-center mb-8">
          <Share2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Share with Friends</h1>
          <p className="text-gray-400">Invite friends and earn rewards together!</p>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
          <div className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
            <code className="text-lg font-mono text-blue-400">{referralCode}</code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-4">
          <p className="text-sm text-gray-400 mb-4">Share via</p>
          
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg p-3 transition-colors"
          >
            Share on WhatsApp
          </button>

          {/* Copy Link Button */}
          <button
            onClick={() => navigator.clipboard.writeText(referralUrl)}
            className="flex items-center justify-center gap-3 w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-3 transition-colors"
          >
            <Copy className="w-5 h-5" />
            Copy Link
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By sharing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
      </div>
    </div>
  );
};

export default SharePage;