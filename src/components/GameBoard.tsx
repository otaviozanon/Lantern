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

function getZonePosition(zone: number, totalVisible: number, idx: number): { x: string; y: string } {
  if (totalVisible <= 3) {
    const positions = [
      { x: '30%', y: '75%' },
      { x: '50%', y: '45%' },
      { x: '70%', y: '20%' },
    ];
    return positions[idx] || positions[positions.length - 1];
  }
  if (totalVisible <= 5) {
    const positions = [
      { x: '18%', y: '82%' },
      { x: '35%', y: '65%' },
      { x: '55%', y: '48%' },
      { x: '70%', y: '30%' },
      { x: '55%', y: '12%' },
    ];
    return positions[idx] || positions[positions.length - 1];
  }
  const positions: Record<number, { x: string; y: string }> = {
    1: { x: '12%', y: '88%' }, 2: { x: '28%', y: '72%' },
    3: { x: '50%', y: '62%' }, 4: { x: '78%', y: '48%' },
    5: { x: '58%', y: '36%' }, 6: { x: '32%', y: '24%' },
    7: { x: '48%', y: '12%' }, 8: { x: '48%', y: '4%' },
  };
  return positions[zone] || { x: '50%', y: '50%' };
}

function RequirementDice({ zone }: { zone: number }) {
  const req = ZONE_REQUIREMENTS[zone];
  if (!req) return null;
  if (req.rule === 'bonfire') return null;

  if (req.rule === 'fixed') {
    const faces: (number | '?')[] = [...req.fixed];
    while (faces.length < 6) faces.push('?');
    return (
      <div className="flex gap-[1px] mt-0.5">
        {faces.map((face, i) => (
          <div key={i} className={clsx(
            'w-[14px] h-[16px] rounded-[1px] flex items-center justify-center text-[7px] font-mono font-bold',
            face === '?' ? 'bg-white/5 text-[#666688] border border-white/5' : 'bg-[#f5eedc]/30 text-[#e0e0e0]'
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
          <div key={`a${i}`} className="w-[14px] h-[16px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-[#ffd700]/30 text-[#ffd700] border border-[#ffd700]/20">?</div>
        ))}
        {[0, 1, 2].map(i => (
          <div key={`b${i}`} className="w-[14px] h-[16px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-[#ff8800]/30 text-[#ff8800] border border-[#ff8800]/20">?</div>
        ))}
      </div>
    );
  }

  if (req.rule === 'sextet') {
    return (
      <div className="flex gap-[1px] mt-0.5">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="w-[14px] h-[16px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-[#ff8800]/30 text-[#ff8800] border border-[#ff8800]/20">=</div>
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
    <div className="flex-1 relative min-h-0 pt-14 pointer-events-none">
      <div className="relative w-full h-full max-w-3xl mx-auto">
        {visibleZones.map((zone, idx) => {
          const icon = ZONE_ICONS[zone] || 'pixelarticons:skull';
          const pos = getZonePosition(zone, visibleZones.length, idx);
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
                opacity: isNext ? 0.4 : isCleared ? 0.5 : 1,
                scale: isActive ? 1.2 : 0.85,
              }}
              transition={{ delay: idx * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.div
                animate={{
                  borderColor: isActive ? '#e8c34b' : isCleared ? '#5b9a4e' : isNext ? 'rgba(212,197,169,0.15)' : 'rgba(212,197,169,0.1)',
                  boxShadow: isActive
                    ? ['0 0 12px rgba(232,195,75,0.2)', '0 0 24px rgba(232,195,75,0.4)', '0 0 12px rgba(232,195,75,0.2)']
                    : 'none',
                }}
                transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                className={clsx(
                  'w-12 h-12 rounded-full flex items-center justify-center border transition-colors',
                    isActive ? 'bg-[#ff8800]/20 shadow-lg'
                      : isCleared ? 'bg-[#00ff66]/20'
                      : isNext ? 'bg-[#12122a]'
                      : 'bg-[#0a0a1a]/50'
                )}
              >
                <Icon icon={icon} className={clsx(
                  'w-5 h-5',
                  isActive ? 'text-[#ffd700]' : isCleared ? 'text-[#00ff66]' : isNext ? 'text-[#e0e0e0]/20' : 'text-[#e0e0e0]/30'
                )} />
              </motion.div>

              <RequirementDice zone={zone} />

              <span className={clsx(
                'text-[7px] leading-none text-center max-w-[60px]',
                isActive ? 'text-[#e0e0e0]/60' : 'text-[#e0e0e0]/15'
              )}>
                {isNext ? '???' : t(`zone${zone}` as any)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
