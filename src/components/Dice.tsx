import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Dice as DiceType } from '../types/game';

const DICE_DOTS: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

export const DiceComponent: React.FC<{
  dice: DiceType;
  onClick?: () => void;
  className?: string;
  small?: boolean;
}> = ({ dice, onClick, className, small }) => {
  const size = small ? 'w-10 h-10' : 'w-14 h-14 md:w-16 md:h-16';
  const dotSize = small ? 'w-2 h-2' : 'w-2.5 h-2.5 md:w-3 md:h-3';

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={clsx(
        size,
        'rounded-lg cursor-pointer transition-all select-none relative',
        dice.selected
          ? 'bg-lantern-gold text-lantern-dark ring-2 ring-lantern-gold ring-offset-2 ring-offset-lantern-dark'
          : 'bg-[#f5eedc] text-lantern-dark hover:bg-[#fff8e7]',
        className
      )}
    >
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1">
        {DICE_DOTS[dice.value]?.map(([row, col], i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
            className={clsx(dotSize, 'rounded-full bg-current')}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
          />
        )) || null}
      </div>
    </motion.div>
  );
};
