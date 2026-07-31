import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Swords, Sword, Wand2, Shield } from 'lucide-react';
import { AbilityName } from '../types/game';

const ICON_MAP: Record<string, React.ElementType> = {
  criticalHit: Sword,
  counterAttack: Swords,
  magicSpell: Wand2,
  constitution: Shield,
};

interface AbilityButtonProps {
  name: AbilityName | 'constitution';
  label: string;
  description: string;
  available: number;
  total: number;
  preview?: string;
  disabled?: boolean;
  onClick: () => void;
}

export const AbilityButton: React.FC<AbilityButtonProps> = ({
  name,
  label,
  description,
  available,
  total,
  preview,
  disabled,
  onClick,
}) => {
  const Icon = ICON_MAP[name] || Sword;
  const isDepleted = available <= 0;
  const isDisabled = disabled || isDepleted;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05, y: -2 } : undefined}
      whileTap={!isDisabled ? { scale: 0.93 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors min-w-[80px] relative overflow-hidden',
        isDisabled
          ? 'opacity-20 cursor-not-allowed border-white/5 bg-white/5'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-lantern-bronze/50'
      )}
    >
      {/* Ripple on click */}
      {!isDisabled && (
        <motion.div
          key={available}
          initial={{ opacity: 0, scale: 0 }}
          animate={available < (total || 1) ? { opacity: 0 } : {}}
          className="absolute inset-0 bg-lantern-bronze/20 rounded-xl"
        />
      )}

      <Icon className="w-5 h-5 text-lantern-gold" />
      <span className="text-xs font-display font-bold text-lantern-parchment tracking-wider">
        {label}
      </span>
      {preview && !isDisabled && (
        <motion.span
          key={preview}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-mono text-lantern-bronze"
        >
          {preview}
        </motion.span>
      )}
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              backgroundColor: i < available ? '#c97d3f' : '#2a2015',
              scale: i === available - 1 && available > 0 ? [1, 1.4, 1] : i < available ? 1 : 0.9,
            }}
            transition={{ duration: 0.3 }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>
      <span className="text-[9px] text-lantern-parchment/40 font-mono">
        {available}/{total}
      </span>
    </motion.button>
  );
};
