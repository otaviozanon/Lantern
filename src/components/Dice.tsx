import React, { useEffect, useState } from 'react';
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

const springs = {
  snappy: { type: 'spring' as const, stiffness: 300, damping: 30 },
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
};

export const DiceComponent: React.FC<{
  dice: DiceType;
  onClick?: () => void;
  className?: string;
  small?: boolean;
  animateRoll?: boolean;
}> = ({ dice, onClick, className, small, animateRoll }) => {
  const size = small ? 'w-10 h-10' : 'w-14 h-14 md:w-16 md:h-16';
  const dotSize = small ? 'w-2 h-2' : 'w-2.5 h-2.5 md:w-3 md:h-3';
  const [rollKey, setRollKey] = useState(0);

  useEffect(() => {
    if (animateRoll) {
      setRollKey(k => k + 1);
    }
  }, [dice.value, animateRoll]);

  return (
    <motion.div
      key={`${dice.id}-${rollKey}`}
      whileHover={onClick ? { scale: 1.08, y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.92 } : undefined}
      onClick={onClick}
      initial={animateRoll ? {
        rotateX: Math.random() * 720 - 360,
        rotateY: Math.random() * 720 - 360,
        scale: 0.6,
        y: -40,
      } : undefined}
      animate={{
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        y: 0,
        boxShadow: dice.selected
          ? '0 0 20px rgba(232, 195, 75, 0.5), 0 0 40px rgba(232, 195, 75, 0.2)'
          : '0 4px 12px rgba(0,0,0,0.3)',
      }}
      transition={animateRoll ? {
        ...springs.bouncy,
        duration: 0.4,
      } : springs.snappy}
      className={clsx(
        size,
        'rounded-lg cursor-pointer transition-none select-none relative preserve-3d',
        dice.selected
          ? 'bg-lantern-gold text-lantern-dark'
          : 'bg-lantern-parchment text-lantern-dark',
        className
      )}
      style={{ perspective: 600 }}
    >
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1">
        {DICE_DOTS[dice.value]?.map(([row, col], i) => (
          <motion.div
            key={i}
            initial={animateRoll ? { scale: 0 } : undefined}
            animate={{ scale: 1 }}
            transition={{ delay: animateRoll ? 0.15 + i * 0.03 : i * 0.05, type: 'spring', stiffness: 300 }}
            className={clsx(dotSize, 'rounded-full bg-current')}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
          />
        )) || null}
      </div>
    </motion.div>
  );
};
