"use client"
import { useParams } from 'next/navigation';
import HeadsOrTails from '@/components/games/HeadOrTails';
import SpinWheel from '@/components/games/SpinWheel';


export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;

  const games = {
    'heads-tails': HeadsOrTails,
    'spin-wheel': SpinWheel,
  };

  const GameComponent = games[gameId as keyof typeof games];

  if (!GameComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Game Not Found</h1>
          <p className="text-gray-400">The game you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return <GameComponent />;
}