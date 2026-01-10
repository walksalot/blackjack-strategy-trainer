import { motion } from 'framer-motion';
import type { Card as CardType } from '../../types';
import { SUIT_SYMBOLS } from '../../types';

interface CardProps {
  card: CardType;
  index?: number;
  isDealing?: boolean;
  highlight?: 'correct' | 'incorrect' | null;
}

export function Card({ card, index = 0, isDealing = false, highlight = null }: CardProps) {
  const suitSymbol = SUIT_SYMBOLS[card.suit];

  return (
    <motion.div
      initial={isDealing ? { opacity: 0, y: -50, rotateZ: -10, scale: 0.8 } : false}
      animate={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-32
        bg-white rounded-xl shadow-xl
        flex flex-col items-center justify-center
        select-none cursor-default
        border-2
        ${card.isRed ? 'text-red-600' : 'text-gray-900'}
        ${highlight === 'correct' ? 'border-green-400 shadow-green-400/50 shadow-lg' : ''}
        ${highlight === 'incorrect' ? 'border-red-400 shadow-red-400/50 shadow-lg' : ''}
        ${!highlight ? 'border-gray-200' : ''}
      `}
      style={{
        fontFamily: 'Georgia, serif',
      }}
    >
      {/* Inner decorative border */}
      <div className="absolute inset-2 border border-gray-100 rounded-lg pointer-events-none" />

      {/* Top-left corner */}
      <div className="absolute top-1.5 left-2 flex flex-col items-center leading-none">
        <span className="text-sm font-bold">{card.value}</span>
        <span className="text-xs">{suitSymbol}</span>
      </div>

      {/* Center */}
      <div className="flex flex-col items-center">
        <span className="text-4xl sm:text-5xl font-bold">{card.value}</span>
        <span className="text-2xl sm:text-3xl -mt-1">{suitSymbol}</span>
      </div>

      {/* Bottom-right corner (rotated) */}
      <div className="absolute bottom-1.5 right-2 flex flex-col items-center leading-none rotate-180">
        <span className="text-sm font-bold">{card.value}</span>
        <span className="text-xs">{suitSymbol}</span>
      </div>
    </motion.div>
  );
}

// Face-down card back
export function CardBack({ index = 0, isDealing = false }: { index?: number; isDealing?: boolean }) {
  return (
    <motion.div
      initial={isDealing ? { opacity: 0, y: -50, rotateZ: -10 } : false}
      animate={{ opacity: 1, y: 0, rotateZ: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className="
        w-20 h-28 sm:w-24 sm:h-32
        rounded-xl shadow-xl
        bg-gradient-to-br from-red-700 via-red-800 to-red-900
        border-2 border-red-600
        flex items-center justify-center
      "
    >
      {/* Pattern */}
      <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-lg bg-red-900/50 border border-red-500/30 flex items-center justify-center">
        <div className="w-10 h-14 sm:w-12 sm:h-16 rounded border border-gold/30 bg-gradient-to-br from-gold/20 to-gold/5" />
      </div>
    </motion.div>
  );
}
