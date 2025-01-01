import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '../Navbar';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from 'next-auth/react';
import { UserProps } from '@/lib/type';
import axios from 'axios';

export default function HeadsOrTails() {
  const [bet, setBet] = useState('10');
  const [prediction, setPrediction] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [userCredits, setUserCredits] = useState(0);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  
  const betAmount = ['10', '20', '30', '40', '50', '60'];

  // Fetch user credits when component mounts
  useEffect(() => {
    const fetchUserCredits = async () => {
      setLoading(true);
      if (!session?.user) {
        return;
      }

      try {
        const userId = (session?.user as UserProps)?.id;
        const response = await axios.get(`/api/checkCredit?userId=${userId}`);
        console.log(response.data.credits);
        setUserCredits(response.data.credits);
        setLoading(false);
      } catch (err) {
        console.log(err);
      } 
    };

    fetchUserCredits();
  }, []);

  const handleGameResult = async (outcome: 'heads' | 'tails') => {
    setResult(outcome);
    setIsFlipping(false);
    setShowResult(true);

    if (!prediction) return;

    const amount = parseInt(bet);
    const won = outcome === prediction;

    try {
      await axios.post('/api/creditmanage', {
        userId: (session?.user as UserProps)?.id,
        prediction,
        outcome,
        betAmount: amount,
        won
      });

      // Update local credit state based on game result
      setUserCredits(prev => won ? prev + amount : prev - amount);
    } catch (error) {
      console.error('Error managing credits:', error);
    }
  };

  const flipCoin = () => {
    if (!prediction || isFlipping) return;
    if (userCredits < parseInt(bet)) {
      alert("You don't have enough credits to make this bet.");
      return;
    }

    setIsFlipping(true);
    setResult(null);
    setShowResult(false);
    setFlipCount(prev => prev + 1);
    
    setTimeout(() => {
      // Ensure 50-50 chance by using Math.random() < 0.5
      const outcome = 'heads';
      handleGameResult(outcome);
    }, 2000);
  };

  const getResultMessage = () => {
    if (!result || !prediction) return { title: '', description: '' };
    
    const won = result === prediction;
    const amount = parseInt(bet);
    
    return {
      title: won ? '🎉 Congratulations!' : '😔 Better Luck Next Time',
      description: won 
        ? `You won $${amount}! Your prediction of ${prediction} was correct.`
        : `You lost $${amount}. The coin landed on ${result}, but you chose ${prediction}.`
    };
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">

      <Navbar />
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
        </div>
      ) : (
        <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-10 px-4"
      >
        <motion.h1
          className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          Heads or Tails
        </motion.h1>

        <div className="mb-12 relative">
          <motion.div
            key={flipCount}
            className="rounded-full w-48 h-48 mx-auto relative"
            initial={{ rotateY: 0 }}
            animate={{ 
              rotateY: isFlipping ? 1440 : 0,
              scale: isFlipping ? 1.2 : 1
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <Image 
              src="/coin.png" 
              alt="Coin" 
              fill 
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
          
          
        </div>

        <div className="space-y-8">
          <motion.div 
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-purple-300">Select a side</h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {['heads', 'tails'].map((side) => (
                <motion.div
                  key={side}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setPrediction(side as 'heads' | 'tails')}
                    className={`
                      text-xl py-6 px-10 rounded-xl
                      transition-all duration-300
                      ${prediction === side 
                        ? 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30' 
                        : 'bg-gray-800 hover:bg-gray-700'
                      }
                    `}
                  >
                    {side.charAt(0).toUpperCase() + side.slice(1)}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-center text-purple-300">
              Bet Amount
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto px-4">
              {betAmount.map((amount) => (
                <motion.div
                  key={amount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setBet(amount)}
                    className={`
                      w-full text-xl py-4 rounded-xl
                      transition-all duration-300
                      ${bet === amount 
                        ? 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/30' 
                        : 'bg-gray-800 hover:bg-gray-700'
                      }
                    `}
                  >
                    ${amount}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={flipCoin}
                disabled={!prediction || isFlipping}
                className={`
                  text-xl py-6 px-16 rounded-xl
                  ${!prediction || isFlipping 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg shadow-purple-500/30'
                  }
                `}
              >
                {isFlipping ? 'Flipping...' : 'Flip Coin'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="bg-gray-900 text-white border-purple-500 border px-7">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2">
              {getResultMessage().title}
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-center text-lg">
              {getResultMessage().description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => setShowResult(false)}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Play Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>

      )}

      
    </div>
  );
}