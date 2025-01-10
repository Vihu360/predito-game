import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function SpinWheel() {
  const [bet, setBet] = useState('10');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const sections = ['10', '20', '30', '40', '50'];
  const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'];

  const getSection = (degrees : number) => {
    const normalizedDegrees = degrees % 360;
    const sectionIndex = Math.floor(((360 - normalizedDegrees) % 360) / 72);
    return sections[sectionIndex];
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const newRotation = rotation + 1800 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const result = getSection(newRotation);
      if (bet === result) {
        alert('Congratulations! You Won! 🎉');
      } else {
        alert('Sorry, You Lost! Try again! 😢');
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Fortune Wheel</h1>
        
        <div className="mb-8">
          <div className="relative w-64 mx-auto mb-8">
            {/* Fixed pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl z-10">
              ▼
            </div>
            
            {/* Wheel */}
            <motion.svg
              className="w-64 h-64"
              viewBox="0 0 100 100"
              animate={{ rotate: rotation }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              {sections.map((section, index) => {
                const angle = (index * 72) - 90;
                const endAngle = ((index + 1) * 72) - 90;
                const startRadians = (angle * Math.PI) / 180;
                const endRadians = (endAngle * Math.PI) / 180;
                
                const startX = 50 + 50 * Math.cos(startRadians);
                const startY = 50 + 50 * Math.sin(startRadians);
                const endX = 50 + 50 * Math.cos(endRadians);
                const endY = 50 + 50 * Math.sin(endRadians);
                
                const largeArcFlag = 0;
                
                const pathData = [
                  'M', 50, 50,
                  'L', startX, startY,
                  'A', 50, 50, 0, largeArcFlag, 1, endX, endY,
                  'Z'
                ].join(' ');

                const textAngle = angle + 36;
                const textRadius = 35;
                const textX = 50 + textRadius * Math.cos((textAngle * Math.PI) / 180);
                const textY = 50 + textRadius * Math.sin((textAngle * Math.PI) / 180);

                return (
                  <g key={index}>
                    <path
                      d={pathData}
                      fill={colors[index]}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${angle + 90}, ${textX}, ${textY})`}
                    >
                      {section}
                    </text>
                  </g>
                );
              })}
            </motion.svg>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Choose Your Number</label>
            <select 
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              className="max-w-[200px] mx-auto text-center bg-white text-black p-2 rounded"
            >
              {sections.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
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