import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice } from '../types/game';
import { DiceComponent } from './Dice';

interface DiceTrayProps {
  dice: Dice[];
  onDiceClick: (id: string) => void;
  matchedIndices?: Set<number>;
}

export const DiceTray: React.FC<DiceTrayProps> = ({ dice, onDiceClick, matchedIndices }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 p-4">
      <AnimatePresence mode="popLayout">
        {dice.map((d, idx) => (
          <motion.div
            key={d.id}
            layout
            initial={{ opacity: 0, y: -20, rotate: Math.random() * 20 - 10 }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: 0,
              boxShadow: matchedIndices?.has(idx)
                ? '0 0 12px rgba(91, 154, 78, 0.6)'
                : 'none',
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: idx * 0.05 }}
          >
            <DiceComponent
              dice={d}
              onClick={() => onDiceClick(d.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
