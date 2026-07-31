import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice } from '../types/game';
import { DiceComponent } from './Dice';

interface DiceTrayProps {
  dice: Dice[];
  onDiceClick: (id: string) => void;
  matchedIndices?: Set<number>;
}

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: -24, rotate: -15, scale: 0.7 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.5,
    transition: { duration: 0.15 },
  },
};

export const DiceTray: React.FC<DiceTrayProps> = ({ dice, onDiceClick, matchedIndices }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-wrap justify-center gap-3 p-4 min-h-[80px]"
    >
      {dice.map((d, idx) => (
        <motion.div
          key={d.id}
          variants={item}
          layout
          animate={{
            filter: matchedIndices?.has(idx)
              ? 'drop-shadow(0 0 8px rgba(91, 154, 78, 0.8))'
              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <DiceComponent
            dice={d}
            onClick={() => onDiceClick(d.id)}
          />
        </motion.div>
      ))}
      {dice.length === 0 && (
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 border-dashed border-lantern-parchment/10 animate-pulse" />
      )}
    </motion.div>
  );
};
