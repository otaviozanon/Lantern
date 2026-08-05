import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Icon } from '@iconify/react';
import { AbilityName } from '../types/game';

const ICON_MAP: Record<string, string> = {
  criticalHit: 'pixelarticons:sword',
  counterAttack: 'pixelarticons:sync',
  magicSpell: 'pixelarticons:magic-edit',
  constitution: 'pixelarticons:shield',
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
  const icon = ICON_MAP[name] || 'pixelarticons:sword';
  const isDepleted = available <= 0;
  const isDisabled = disabled || isDepleted;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05, y: -2 } : undefined}
      whileTap={!isDisabled ? { scale: 0.93 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'flex flex-col items-center gap-1 p-2 border-2 relative min-w-[90px] transition-none',
        isDisabled
          ? 'opacity-30 cursor-not-allowed border-lantern-dark/80 bg-lantern-dark'
          : 'border-lantern-bronze/30 bg-lantern-dark/80 shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:bg-lantern-dark/60 hover:border-lantern-gold/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
      )}
    >
      {/* Ripple on click */}
      {!isDisabled && (
        <motion.div
          key={available}
          initial={{ opacity: 0, scale: 0 }}
          animate={available < (total || 1) ? { opacity: 0 } : {}}
          className="absolute inset-0 bg-lantern-gold/20"
        />
      )}

      <Icon icon={icon} className="w-4 h-4 text-lantern-gold" />
      <span className="text-[10px] font-bold text-lantern-parchment tracking-wider" style={{ textWrap: 'balance' as any }}>
        {label}
      </span>
      <span className="font-pixel-sans text-[14px] text-lantern-parchment/30 text-center leading-tight max-w-[100px]" style={{ textWrap: 'balance' as any }}>
        {description}
      </span>
      {preview && !isDisabled && (
        <motion.span
          key={preview}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-mono text-lantern-ember"
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
                  backgroundColor: i < available ? '#e8c34b' : '#1a140c',
              scale: i === available - 1 && available > 0 ? [1, 1.4, 1] : i < available ? 1 : 0.9,
            }}
            transition={{ duration: 0.3 }}
            className="w-2 h-2"
          />
        ))}
      </div>
      <span className="text-[9px] text-lantern-parchment/30 font-mono">
        {available}/{total}
      </span>
    </motion.button>
  );
};
