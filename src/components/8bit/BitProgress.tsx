import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface BitProgressProps {
  value: number;
  max?: number;
  color?: 'gold' | 'green' | 'red' | 'cyan';
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const BitProgress: React.FC<BitProgressProps> = ({
  value, max = 100, color = 'gold', label, showValue, className
}) => {
  const pct = Math.min((value / max) * 100, 100);
  const colors: Record<string, string> = {
    gold: 'bg-lantern-gold',
    green: 'bg-lantern-moss',
    red: 'bg-lantern-ember',
    cyan: 'bg-lantern-gold',
  };

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-[8px] retro text-lantern-parchment/30">
          {label && <span>{label}</span>}
          {showValue && <span>{value}/{max}</span>}
        </div>
      )}
      <div className="h-3 bg-lantern-dark border-2 border-lantern-bronze/30 overflow-hidden relative">
        <motion.div
          className={clsx('h-full', colors[color])}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
        }} />
      </div>
    </div>
  );
};
