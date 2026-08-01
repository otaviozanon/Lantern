import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Icon } from '@iconify/react';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { EXPERIENCE_LINES } from '../constants/game';

const ABILITY_ICONS: Record<string, string> = {
  criticalHit: 'pixelarticons:sword', counterAttack: 'pixelarticons:sync', magicSpell: 'pixelarticons:magic-edit', constitution: 'pixelarticons:shield',
};

const ABILITY_DESC_KEYS: Record<string, string> = {
  criticalHit: 'flipDie', counterAttack: 'addSubtract', magicSpell: 'rerollOne', constitution: 'rerollSelected',
};

export const CharacterSheet: React.FC = () => {
  const { state } = useGame();
  const { t } = useLanguage();
  const { phase, abilities, experience, experienceLinesCompleted } = state;
  const shouldShow = phase !== 'SETUP' && phase !== 'GAME_OVER' && phase !== 'VICTORY';

  const experienceLines = (() => {
    if (!shouldShow) return [0, 0, 0];
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

  if (!shouldShow) return null;

  return (
    <footer className="relative z-10 p-2.5 shrink-0">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.15 }}
        className="bg-lantern-dark/80 border-2 border-lantern-bronze/30 rounded-none px-3 py-2.5 max-w-3xl mx-auto shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="hidden sm:flex items-center justify-center w-10 h-10 shrink-0"
        >
          <Icon icon="pixelarticons:human-run" className="w-8 h-8 text-lantern-bronze/40" />
        </motion.div>
        <div className="flex items-start gap-2 overflow-x-auto scrollbar-hide min-w-0 flex-1">
          {(['criticalHit', 'counterAttack', 'magicSpell', 'constitution'] as const).map((key, idx) => {
            const a = abilities[key];
            const icon = ABILITY_ICONS[key] || 'pixelarticons:sword';
            const descKey = ABILITY_DESC_KEYS[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex-1 flex flex-col items-center gap-0.5 min-w-0"
              >
                <Icon icon={icon} className="w-3.5 h-3.5 text-lantern-gold" />
                <span className="text-[8px] font-bold text-lantern-parchment/70 tracking-wider text-center leading-tight" style={{ textWrap: 'balance' as any }}>
                  {t(key)}
                </span>
                <div className="flex flex-wrap justify-center gap-0.5 max-w-[70px]">
                  {Array.from({ length: a.total }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        backgroundColor: i < a.available ? '#e8c34b' : '#1a140c',
                        scale: i === a.available && a.available < a.total ? [0.8, 1.3, 1] : i < a.available ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-1.5 h-1.5"
                    />
                  ))}
                </div>
                <span className="text-[7px] text-lantern-parchment/30 text-center leading-tight px-0.5" style={{ textWrap: 'balance' as any }}>
                  {t(descKey as any)}
                </span>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-20 flex-none flex flex-col items-center gap-0.5 border-l border-lantern-bronze/30 pl-2"
          >
            <Icon icon="pixelarticons:book-open" className="w-3.5 h-3.5 text-lantern-gold" />
            <span className="text-[8px] font-bold text-lantern-parchment/60 tracking-wider">{t('xp')}</span>
            <div className="flex flex-col gap-0.5">
              {experienceLines.map((filled, lineIdx) => (
                <div key={lineIdx} className="flex gap-0.5">
                  {Array.from({ length: EXPERIENCE_LINES[lineIdx] }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        backgroundColor: i < filled ? '#e8c34b' : '#1a140c',
                        scale: i === filled - 1 && filled > 0 ? [1, 1.4, 1] : 1,
                        boxShadow: lineIdx < experienceLinesCompleted && i === EXPERIENCE_LINES[lineIdx] - 1 && filled === EXPERIENCE_LINES[lineIdx]
                          ? ['0 0 4px rgba(232,195,75,0.5)', '0 0 8px rgba(232,195,75,0.8)', '0 0 4px rgba(232,195,75,0.5)']
                          : 'none',
                      }}
                      transition={lineIdx < experienceLinesCompleted ? { repeat: Infinity, duration: 2 } : { duration: 0.3 }}
                      className="w-1.5 h-1.5"
                    />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};
