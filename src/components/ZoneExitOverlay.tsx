import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
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
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
      className="fixed bottom-[88px] left-0 right-0 z-40 border-t border-lantern-moss/30 px-3 py-3" style={{ background: 'rgba(13,10,5,0.95)' }}
    >
      <div className="flex flex-col items-center gap-5">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.1 }}
        >
          <h2 className="text-lg font-display font-bold text-lantern-moss tracking-wider uppercase">
            {t('zoneCleared', { zone: state.currentZone })}
          </h2>
        </motion.div>

        {state.pendingSkillBonuses > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-sm text-lantern-parchment/70 font-body">
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
                    className={`px-4 py-2 rounded-lg border font-display text-xs font-bold uppercase tracking-wider transition-colors ${
                      atMax
                        ? 'opacity-20 cursor-not-allowed border-white/5'
                        : 'border-lantern-gold/30 hover:bg-lantern-gold/10 text-lantern-gold'
                    }`}
                  >
                    {key === 'criticalHit' ? t('crit') : key === 'counterAttack' ? t('counter') : key === 'magicSpell' ? t('spell') : t('endure')}
                    {' '}({a.total}/{MAX_CIRCLES})
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {state.pendingSkillBonuses === 0 && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleContinue}
            className="bg-lantern-gold text-lantern-dark px-10 py-2.5 font-display font-black rounded-full transition-colors shadow-lg text-sm uppercase tracking-[0.2em]"
          >
            {state.currentZone === 8 ? t('seeResults') : t('nextZone')}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
