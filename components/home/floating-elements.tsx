'use client';

import { motion } from 'framer-motion';
import { Coins, PiggyBank, Gift, Sparkles, Banknote, CreditCard } from 'lucide-react';

/** Floating element configuration */
interface FloatingElementConfig {
  id: string;
  icon: React.ReactNode;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  size: number;
  delay: number;
  duration: number;
  bgColor: string;
}

/** Predefined floating elements with positions matching the design */
const floatingElements: FloatingElementConfig[] = [
  {
    id: 'coins',
    icon: <Coins className="w-5 h-5 text-yellow-400" />,
    position: { top: '15%', left: '8%' },
    size: 40,
    delay: 0,
    duration: 3,
    bgColor: 'bg-yellow-500/20',
  },
  {
    id: 'piggy',
    icon: <PiggyBank className="w-5 h-5 text-pink-400" />,
    position: { top: '20%', right: '10%' },
    size: 44,
    delay: 0.5,
    duration: 3.5,
    bgColor: 'bg-pink-500/20',
  },
  {
    id: 'gift',
    icon: <Gift className="w-4 h-4 text-purple-400" />,
    position: { top: '35%', right: '5%' },
    size: 36,
    delay: 1,
    duration: 4,
    bgColor: 'bg-purple-500/20',
  },
  {
    id: 'sparkles',
    icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
    position: { top: '30%', left: '5%' },
    size: 32,
    delay: 1.5,
    duration: 3.2,
    bgColor: 'bg-cyan-500/20',
  },
  {
    id: 'banknote',
    icon: <Banknote className="w-5 h-5 text-green-400" />,
    position: { bottom: '35%', left: '12%' },
    size: 40,
    delay: 0.8,
    duration: 3.8,
    bgColor: 'bg-green-500/20',
  },
  {
    id: 'card',
    icon: <CreditCard className="w-4 h-4 text-blue-300" />,
    position: { bottom: '40%', right: '8%' },
    size: 36,
    delay: 1.2,
    duration: 3.4,
    bgColor: 'bg-blue-400/20',
  },
];

/**
 * Floating animated elements that surround the hero avatar
 */
const FloatingElements = (): React.ReactNode => {
  return (
    <>
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute ${element.bgColor} backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg`}
          style={{
            ...element.position,
            width: element.size,
            height: element.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            opacity: { duration: 0.5, delay: element.delay },
            scale: { duration: 0.5, delay: element.delay, type: 'spring', stiffness: 200 },
            y: {
              duration: element.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: element.delay,
            },
            rotate: {
              duration: element.duration * 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: element.delay,
            },
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </>
  );
};

export default FloatingElements;

