import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Icon } from '@iconify/react';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { ZONE_REQUIREMENTS } from '../constants/game';

const ZONE_ICONS: Record<number, string> = {
  1: 'pixelarticons:dog', 2: 'pixelarticons:alien', 3: 'pixelarticons:building-community', 4: 'pixelarticons:skull',
  5: 'pixelarticons:fire', 6: 'pixelarticons:bug', 7: 'pixelarticons:castle', 8: 'pixelarticons:sync',
};

const ZONE_POSITIONS: Record<number, { x: string; y: string }> = {
  1: { x: '12%', y: '88%' }, 2: { x: '28%', y: '72%' },
  3: { x: '50%', y: '62%' }, 4: { x: '78%', y: '48%' },
  5: { x: '58%', y: '36%' }, 6: { x: '32%', y: '24%' },
  7: { x: '48%', y: '12%' }, 8: { x: '48%', y: '4%' },
};

function RequirementDice({ zone }: { zone: number }) {
  const req = ZONE_REQUIREMENTS[zone];
  if (!req) return null;

  if (req.rule === 'bonfire') return null;

  if (req.rule === 'fixed') {
    const total = 6;
    const faces: (number | '?')[] = [...req.fixed];
    while (faces.length < total) faces.push('?');

    return (
      <div className="flex gap-[1px] mt-0.5">
        {faces.map((face, i) => (
          <div key={i} className={clsx(
            'w-[14px] h-[16px] rounded-[1px] flex items-center justify-center text-[7px] font-mono font-bold',
            face === '?' ? 'bg-white/5 text-lantern-parchment/15 border border-white/5' : 'bg-[#f5eedc]/30 text-lantern-parchment'
          )}>
            {face}
          </div>
        ))}
      </div>
    );
  }

  if (req.rule === 'fullHouse') {
    return (
      <div className="flex gap-[1px] mt-0.5">
        {[0, 1, 2].map(i => (
          <div key={`a${i}`} className="w-[14px] h-[16px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-lantern-gold/30 text-lantern-gold border border-lantern-gold/20">
            ?
          </div>
        ))}
        {[0, 1, 2].map(i => (
          <div key={`b${i}`} className="w-[14px] h-[16px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-lantern-bronze/30 text-lantern-bronze border border-lantern-bronze/20">
            ?
          </div>
        ))}
      </div>
    );
  }

  if (req.rule === 'sextet') {
    return (
      <div className="flex gap-[1px] mt-0.5">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="w-[14px] h-[16px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-lantern-ember/30 text-lantern-ember border border-lantern-ember/20">
            =
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { t } = useLanguage();
  const { phase, currentZone, clearedZones } = state;
  if (phase === 'SETUP' || phase === 'GAME_OVER' || phase === 'VICTORY') return null;

  const visibleZones = Array.from({ length: 8 }, (_, i) => i + 1).filter(z =>
    z <= currentZone + 1 || clearedZones[z]
  );

  return (
    <div className="fixed inset-0 pt-16 pointer-events-none" style={{ paddingBottom: '88px' }}>
      <div className="relative w-full h-full max-w-3xl mx-auto">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <motion.path
            d="M12% 88% Q20% 80% 28% 72% Q39% 67% 50% 62% Q64% 55% 78% 48% Q68% 42% 58% 36% Q45% 30% 32% 24% Q40% 18% 48% 12% L48% 4%"
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

        {visibleZones.map((zone, idx) => {
          const icon = ZONE_ICONS[zone] || 'pixelarticons:skull';
          const pos = ZONE_POSITIONS[zone];
          const isCleared = clearedZones[zone];
          const isActive = currentZone === zone;
          const isNext = zone === currentZone + 1;

          return (
            <motion.div
              key={zone}
              className="absolute flex flex-col items-center gap-0.5"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isCleared ? 0.5 : 1,
                scale: isActive ? 1.2 : isCleared ? 0.8 : 0.85,
              }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <span className={clsx(
                'text-[10px] font-mono font-bold leading-none',
                isActive ? 'text-lantern-gold' : isCleared ? 'text-lantern-moss' : 'text-lantern-parchment/30'
              )}>
                {zone}
              </span>
              <motion.div
                animate={{
                  borderColor: isActive ? '#e8c34b' : isCleared ? '#5b9a4e' : 'rgba(212,197,169,0.1)',
                  boxShadow: isActive
                    ? ['0 0 12px rgba(232,195,75,0.2)', '0 0 24px rgba(232,195,75,0.4)', '0 0 12px rgba(232,195,75,0.2)']
                    : 'none',
                }}
                transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                className={clsx(
                  'w-12 h-12 rounded-full flex items-center justify-center border transition-colors',
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

              <RequirementDice zone={zone} />

              <span className={clsx(
                'text-[7px] font-body leading-none text-center max-w-[60px]',
                isActive ? 'text-lantern-parchment/60' : 'text-lantern-parchment/15'
              )}>
                {isNext && !clearedZones[zone] ? '???' : t(`zone${zone}` as any)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
