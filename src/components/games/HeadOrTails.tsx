"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HeadsOrTails() {
  const [bet, setBet] = useState('10');
  const [prediction, setPrediction] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);

  const flipCoin = () => {
    if (!prediction || isFlipping) return;
    
    setIsFlipping(true);
    setResult(null);
    
    // Simulate coin flip
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setIsFlipping(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Heads or Tails</h1>
        
        <div className="mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Bet</label>
            <Input
              type="number"
              min="10"
              max="1000"
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              className="max-w-[200px] mx-auto text-center"
            />
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => setPrediction('heads')}
              className={`px-8 ${prediction === 'heads' ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              Heads
            </Button>
            <Button
              onClick={() => setPrediction('tails')}
              className={`px-8 ${prediction === 'tails' ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              Tails
            </Button>
          </div>

          <Button
            onClick={flipCoin}
            disabled={!prediction || isFlipping}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-2xl font-bold"
            >
              Result: {result.toUpperCase()}
              <p className="mt-4 text-xl">
                {result === prediction ? (
                  <span className="text-green-500">You won ${parseInt(bet) * 2}!</span>
                ) : (
                  <span className="text-red-500">You lost ${bet}</span>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}