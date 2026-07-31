import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Icon } from '@iconify/react';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';

const ZONE_ICONS: Record<number, string> = {
  1: 'pixelarticons:dog', 2: 'pixelarticons:alien', 3: 'pixelarticons:building-community', 4: 'pixelarticons:skull',
  5: 'pixelarticons:fire', 6: 'pixelarticons:bug', 7: 'pixelarticons:castle', 8: 'pixelarticons:sync',
};

const ZONE_POSITIONS: Record<number, { x: string; y: string }> = {
  1: { x: '15%', y: '88%' }, 2: { x: '35%', y: '75%' },
  3: { x: '55%', y: '65%' }, 4: { x: '72%', y: '52%' },
  5: { x: '55%', y: '40%' }, 6: { x: '35%', y: '28%' },
  7: { x: '50%', y: '15%' }, 8: { x: '50%', y: '5%' },
};

export const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { t } = useLanguage();
  const { phase, currentZone, clearedZones } = state;
  if (phase === 'SETUP' || phase === 'GAME_OVER' || phase === 'VICTORY') return null;

  return (
    <div className="fixed inset-0 pt-16 pb-28 pointer-events-none">
      <div className="relative w-full h-full max-w-lg mx-auto">
        {/* Path */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <motion.path
            d="M15% 88% Q25% 81% 35% 75% Q45% 69% 55% 65% Q63% 58% 72% 52% Q63% 46% 55% 40% Q45% 34% 35% 28% Q42% 21% 50% 15% L50% 5%"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="text-lantern-parchment/15"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </svg>

        {Array.from({ length: 8 }, (_, i) => i + 1).map((zone, idx) => {
          const icon = ZONE_ICONS[zone] || 'pixelarticons:skull';
          const pos = ZONE_POSITIONS[zone];
          const isCleared = clearedZones[zone];
          const isActive = currentZone === zone;

          return (
            <motion.div
              key={zone}
              className="absolute flex flex-col items-center gap-0.5"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isCleared ? 0.5 : 1,
                scale: isActive ? 1.15 : isCleared ? 0.8 : 0.85,
              }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.div
                animate={{
                  borderColor: isActive ? '#e8c34b' : isCleared ? '#5b9a4e' : 'rgba(212,197,169,0.1)',
                  boxShadow: isActive
                    ? ['0 0 12px rgba(232,195,75,0.2)', '0 0 24px rgba(232,195,75,0.4)', '0 0 12px rgba(232,195,75,0.2)']
                    : 'none',
                }}
                transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center border transition-colors',
                  isActive
                    ? 'bg-lantern-bronze/20 shadow-lg'
                    : isCleared
                    ? 'bg-lantern-moss/20'
                    : 'bg-lantern-dark/50'
                )}
              >
                <Icon icon={icon} className={clsx(
                  'w-5 h-5',
                  isActive ? 'text-lantern-gold' : isCleared ? 'text-lantern-moss' : 'text-lantern-parchment/30'
                )} />
              </motion.div>

              <span className={clsx(
                'text-[9px] font-display font-bold tracking-wider uppercase',
                isActive ? 'text-lantern-gold' : isCleared ? 'text-lantern-moss/60' : 'text-lantern-parchment/40'
              )}>
                {zone}
              </span>
              <span className={clsx(
                'text-[7px] font-body leading-none text-center max-w-[55px]',
                isActive ? 'text-lantern-parchment/70' : 'text-lantern-parchment/20'
              )}>
                {t(`zone${zone}` as any)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
