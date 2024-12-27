"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SpinWheel() {
  const [bet, setBet] = useState('50');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const newRotation = rotation + 1800 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Fortune Wheel</h1>

        <div className="mb-8">
          <motion.div
            className="w-64 h-64 mx-auto mb-8 rounded-full border-4 border-purple-500 relative"
            style={{
              background: 'conic-gradient(from 0deg, purple, blue, cyan, green, yellow, orange, red, purple)',
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
              ▼
            </div>
          </motion.div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Bet</label>
            <Input
              type="number"
              min="50"
              max="5000"
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              className="max-w-[200px] mx-auto text-center"
            />
          </div>

          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {isSpinning ? 'Spinning...' : 'Spin Wheel'}
          </Button>
        </div>
      </div>
    </div>
  );
}