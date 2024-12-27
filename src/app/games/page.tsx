"use client"

import { motion } from 'framer-motion';
import GameCard from '@/components/games/GameCard';
import { Coins, Disc, Gift, LineChart, Palette, CoinsIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useSession } from "next-auth/react";


export default function GamesPage() {
  const games = [
    {
      id: 'heads-tails',
      title: 'Heads or Tails',
      description: 'Predict the coin flip outcome and double your credits',
      icon: <CoinsIcon className="w-8 h-8" />,
      color: 'from-yellow-500 to-amber-600',
      minBet: 10,
      maxBet: 1000
    },
    {
      id: 'spin-wheel',
      title: 'Fortune Wheel',
      description: 'Spin the wheel for multiplied rewards',
      icon: <Disc className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-600',
      minBet: 50,
      maxBet: 5000
    },
    {
      id: 'lucky-draw',
      title: 'Lucky Draw',
      description: 'Enter the daily draw for massive prizes',
      icon: <Gift className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-600',
      minBet: 100,
      maxBet: 10000
    },
    {
      id: 'predict-chart',
      title: 'Chart Predictor',
      description: 'Predict market movements and win big',
      icon: <LineChart className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      minBet: 25,
      maxBet: 2500
    },
    {
      id: 'color-selection',
      title: 'Color Rush',
      description: 'Pick the winning color combination',
      icon: <Palette className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      minBet: 15,
      maxBet: 1500
    },
    {
      id: 'coin-flip-streak',
      title: 'Streak Master',
      description: 'Predict consecutive outcomes for multipliers',
      icon: <Coins className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      minBet: 20,
      maxBet: 2000
    }
  ];

  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black ">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    )
  }

  if (!session) {
    return <p>User is not logged in</p>;
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-black '>
    <Navbar />

    <p>{session.user?.name}</p>

    <div className=" text-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
        >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Choose Your Game
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Select from our collection of exciting prediction games
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center">
          {games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
        </div>
      </motion.div>
    </div>
</div>
  );
}