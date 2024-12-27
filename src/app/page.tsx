"use client"

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Gamepad2, Shield, Zap, DollarSign, Users, Trophy } from 'lucide-react';
import Image from 'next/image';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Optional: Update dimensions on window resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-b from-black via-purple-950 to-black'>
      <Navbar />
      <div className="text-white">
        {/* Hero Section */}
        <header className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-500 rounded-full"
                initial={{
                  x: Math.random() * (dimensions.width || 0),
                  y: Math.random() * (dimensions.height || 0),
                  opacity: 0.2
                }}
                animate={{
                  y: [null, Math.random() * -500],
                  opacity: [0.2, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Play, Predict, and WIN
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl max-w-3xl mb-8 text-center text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Experience thrilling games where your predictions lead to rewards. Join thousands of players worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 rounded-full shadow-lg">
                Start Playing Now
              </Button>
            </motion.div>
          </motion.div>
        </header>

        {/* Features Section */}
        <motion.section
          className="py-24 px-6 relative"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" variants={fadeIn}>
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Why Players Choose Us
              </h2>
              <p className="text-xl text-gray-400 mt-4">
                Join the community of winners and experience gaming excellence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Gamepad2 className="w-12 h-12 text-purple-500" />,
                  title: "Exciting Games",
                  description: "Immerse yourself in our diverse collection of thrilling prediction games"
                },
                {
                  icon: <Shield className="w-12 h-12 text-purple-500" />,
                  title: "Secure Platform",
                  description: "Your security is our top priority with advanced encryption"
                },
                {
                  icon: <Zap className="w-12 h-12 text-purple-500" />,
                  title: "Instant Rewards",
                  description: "Win and withdraw your rewards instantly to your account"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-8 rounded-2xl backdrop-blur-lg border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300"
                  variants={fadeIn}
                >
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Games Showcase */}
        <motion.section
          className="py-24 px-6 relative bg-gradient-to-b from-purple-900/20 to-black"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" variants={fadeIn}>
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Featured Games
              </h2>
              <p className="text-xl text-gray-400 mt-4">
                Choose from our selection of premium prediction games
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Fortune Wheel",
                  image: "/api/placeholder/800/400",
                  description: "Spin the wheel and multiply your winnings"
                },
                {
                  title: "Crystal Ball",
                  image: "/api/placeholder/800/400",
                  description: "Predict the future and win big rewards"
                },
                {
                  title: "Lucky Draw",
                  image: "/api/placeholder/800/400",
                  description: "Daily draws with massive prize pools"
                }
              ].map((game, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl"
                  variants={fadeIn}
                >
                  <div className="relative h-[400px] w-full">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 p-6">
                      <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
                      <p className="text-gray-300">{game.description}</p>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                        Play Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="py-24 px-6"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            {[
              { icon: <Users />, value: "1000+", label: "Active Players" },
              { icon: <Trophy />, value: "5 Lakh+", label: "Rewards Paid" },
              { icon: <Gamepad2 />, value: "5 +", label: "Unique Games" },
              { icon: <DollarSign />, value: "99.9%", label: "Payout Rate" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeIn}
              >
                <div className="inline-block p-4 rounded-full bg-purple-900/30 mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-24 px-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Winning?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of players and start your winning journey today!
            </p>
            <Button className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 rounded-full shadow-lg">
              Create Account Now
            </Button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}