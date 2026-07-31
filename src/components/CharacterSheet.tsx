import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Swords, Wand2, Shield, BookOpen } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { ABILITY_LABELS, EXPERIENCE_LINES } from '../constants/game';

const ABILITY_ICONS: Record<string, React.ElementType> = {
  criticalHit: Sword,
  counterAttack: Swords,
  magicSpell: Wand2,
  constitution: Shield,
};

export const CharacterSheet: React.FC = () => {
  const { state } = useGame();
  const { phase, abilities, experience, experienceLinesCompleted } = state;
  if (phase === 'SETUP' || phase === 'GAME_OVER' || phase === 'VICTORY') return null;

  const experienceLines = (() => {
    let remaining = experience;
    const lines: number[] = [];
    for (const lineSize of EXPERIENCE_LINES) {
      const filled = Math.min(remaining, lineSize);
      lines.push(filled);
      remaining -= filled;
    }
    while (lines.length < 3) lines.push(0);
    return lines;
  })();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 p-3">
      <div className="parchment-bg border border-lantern-bronze/20 rounded-2xl px-4 py-3 max-w-3xl mx-auto shadow-2xl">
        <div className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide min-w-0">
          {(['criticalHit', 'counterAttack', 'magicSpell', 'constitution'] as const).map(key => {
            const a = abilities[key];
            const Icon = ABILITY_ICONS[key] || Sword;
            return (
              <div key={key} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <Icon className="w-4 h-4 text-lantern-bronze" />
                <span className="text-[9px] font-display font-bold text-lantern-parchment/60 tracking-wider text-center leading-tight">
                  {ABILITY_LABELS[key]}
                </span>
                <div className="flex flex-wrap justify-center gap-0.5 max-w-[80px]">
                  {Array.from({ length: a.total }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        backgroundColor: i < a.available ? '#c97d3f' : '#2a2015',
                        scale: i < a.available ? 1 : 0.8,
                      }}
                      className="w-2 h-2 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-lantern-parchment/30">
                  {a.available}/{a.total}
                </span>
              </div>
            );
          })}

          <div className="w-24 flex-none flex flex-col items-center gap-1 border-l border-lantern-bronze/10 pl-3">
            <BookOpen className="w-4 h-4 text-lantern-gold" />
            <span className="text-[9px] font-display font-bold text-lantern-parchment/60 tracking-wider">
              XP
            </span>
            <div className="flex flex-col gap-0.5">
              {experienceLines.map((filled, lineIdx) => (
                <div key={lineIdx} className="flex gap-0.5">
                  {Array.from({ length: EXPERIENCE_LINES[lineIdx] }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        backgroundColor: i < filled ? '#e8c34b' : '#2a2015',
                        boxShadow: lineIdx < experienceLinesCompleted && i === EXPERIENCE_LINES[lineIdx] - 1 && filled === EXPERIENCE_LINES[lineIdx]
                          ? '0 0 4px rgba(232, 195, 75, 0.5)'
                          : 'none',
                      }}
                      className="w-1.5 h-1.5 rounded-full"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
