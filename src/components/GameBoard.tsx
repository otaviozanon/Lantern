import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { PawPrint, Ghost, Building2, Skull, Flame, Bug, TowerControl, Swords } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { ZONE_NAMES } from '../constants/game';

const ZONE_ICONS: Record<number, React.ElementType> = {
  1: PawPrint,
  2: Ghost,
  3: Building2,
  4: Skull,
  5: Flame,
  6: Bug,
  7: TowerControl,
  8: Swords,
};

const ZONE_POSITIONS: Record<number, { x: string; y: string }> = {
  1: { x: '15%', y: '88%' },
  2: { x: '35%', y: '75%' },
  3: { x: '55%', y: '65%' },
  4: { x: '72%', y: '52%' },
  5: { x: '55%', y: '40%' },
  6: { x: '35%', y: '28%' },
  7: { x: '50%', y: '15%' },
  8: { x: '50%', y: '5%' },
};

export const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { phase, currentZone, clearedZones } = state;
  if (phase === 'SETUP' || phase === 'GAME_OVER' || phase === 'VICTORY') return null;

  return (
    <div className="fixed inset-0 pt-16 pb-28 pointer-events-none">
      <div className="relative w-full h-full max-w-lg mx-auto">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <path
            d="M15% 88% Q25% 81% 35% 75% Q45% 69% 55% 65% Q63% 58% 72% 52% Q63% 46% 55% 40% Q45% 34% 35% 28% Q42% 21% 50% 15% L50% 5%"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 4"
            className="text-lantern-parchment/10"
            fill="none"
          />
        </svg>

        {Array.from({ length: 8 }, (_, i) => i + 1).map(zone => {
          const Icon = ZONE_ICONS[zone] || Skull;
          const pos = ZONE_POSITIONS[zone];
          const isCleared = clearedZones[zone];
          const isActive = currentZone === zone;

          return (
            <motion.div
              key={zone}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
              animate={{
                scale: isActive ? 1.15 : 0.85,
                opacity: isCleared ? 0.4 : 1,
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center border transition-colors',
                  isActive
                    ? 'bg-lantern-bronze/20 border-lantern-gold shadow-lg shadow-lantern-gold/20'
                    : isCleared
                    ? 'bg-lantern-moss/20 border-lantern-moss/50'
                    : 'bg-lantern-dark/50 border-lantern-parchment/10'
                )}
              >
                <Icon className={clsx(
                  'w-5 h-5',
                  isActive ? 'text-lantern-gold' : isCleared ? 'text-lantern-moss' : 'text-lantern-parchment/30'
                )} />
              </div>
              <span className={clsx(
                'text-[9px] font-display font-bold tracking-wider uppercase',
                isActive ? 'text-lantern-gold' : 'text-lantern-parchment/40'
              )}>
                {zone}
              </span>
              <span className={clsx(
                'text-[8px] font-body leading-none text-center max-w-[60px]',
                isActive ? 'text-lantern-parchment/70' : 'text-lantern-parchment/20'
              )}>
                {ZONE_NAMES[zone]}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
