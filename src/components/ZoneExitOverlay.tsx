import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { GameTooltip } from './GameTooltip';
import { BitButton } from './8bit/BitButton';
import { StatKey } from '../types/game';
import { MAX_CIRCLES } from '../constants/game';

export const ZoneExitOverlay: React.FC = () => {
  const { state, exitZone } = useGame();
  const { t } = useLanguage();
  if (state.phase !== 'ZONE_EXIT') return null;

  const handleBonus = (key: StatKey) => exitZone(key);
  const handleContinue = () => exitZone(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="shrink-0 border-t border-[#008833]/30 px-3 py-3" style={{ background: '#0a0a1a' }}
    >
      <div className="flex flex-col items-center gap-5">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-[#00ff66] tracking-wider uppercase">
            {t('zoneCleared', { zone: state.currentZone })}
          </h2>
        </motion.div>

        {state.pendingSkillBonuses > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-sm text-[#e0e0e0]/70">
              {t('chooseBonus', { remaining: state.pendingSkillBonuses })}
            </p>
            <div className="flex gap-2">
              {(['criticalHit', 'counterAttack', 'magicSpell', 'constitution'] as StatKey[]).map((key, i) => {
                const a = state.abilities[key];
                const atMax = a.total >= MAX_CIRCLES;
                return (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    whileHover={!atMax ? { scale: 1.08 } : undefined}
                    whileTap={!atMax ? { scale: 0.92 } : undefined}
                    onClick={() => !atMax && handleBonus(key)}
                    disabled={atMax}
                    className={`px-4 py-2 border-2 font-bold text-xs uppercase tracking-wider ${
                      atMax
                        ? 'opacity-30 cursor-not-allowed border-[#12122a] bg-[#0a0a1a] text-[#666688]'
                        : 'border-[#ffd700]/30 bg-[#12122a] text-[#ffd700] shadow-[2px_2px_0px_#000] hover:bg-[#1e1e3a] hover:border-[#ffd700] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                    }`}
                  >
                    {key === 'criticalHit' ? t('crit') : key === 'counterAttack' ? t('counter') : key === 'magicSpell' ? t('spell') : t('endure')}
                    {' '}({a.total}/{MAX_CIRCLES})
                  </motion.button>
                );
              })}
            </div>
            <div className="relative mt-2">
              <GameTooltip message={t('tooltipZoneExit' as any)} position="top" />
            </div>
          </motion.div>
        )}

        {state.pendingSkillBonuses === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <BitButton variant="gold" size="lg" onClick={handleContinue}>
              {state.currentZone === 8 ? t('seeResults') : t('nextZone')}
            </BitButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
