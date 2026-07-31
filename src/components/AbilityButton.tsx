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
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all min-w-[80px]',
        isDisabled
          ? 'opacity-20 cursor-not-allowed border-white/5 bg-white/5'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-lantern-bronze/50'
      )}
    >
      <Icon className="w-5 h-5 text-lantern-gold" />
      <span className="text-xs font-display font-bold text-lantern-parchment tracking-wider">
        {label}
      </span>
      {preview && !isDisabled && (
        <span className="text-[10px] font-mono text-lantern-bronze">{preview}</span>
      )}
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor: i < available ? '#c97d3f' : '#2a2015',
              scale: i < available ? 1 : 0.9,
            }}
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
