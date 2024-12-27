"use client"
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface GameProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  minBet: number;
  maxBet: number;
}

interface GameCardProps {
  game: GameProps;
  index: number;
}

export default function GameCard({ game, index }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div className="cursor-pointer absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
        style={{
          background: `linear-gradient(to right, ${game.color})`
        }}
      />
      <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-500 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-r opacity-75 ${game.color}">
            {game.icon}
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-400">Bet Range</span>
            <p className="font-semibold">${game.minBet} - ${game.maxBet}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2">{game.title}</h3>
        <p className="text-gray-400 mb-6">{game.description}</p>

        <Link href={`/games/${game.id}`}>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Play Now
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}