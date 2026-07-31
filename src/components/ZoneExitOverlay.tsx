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

  const handleBonus = (key: StatKey) => {
    exitZone(key);
  };

  const handleContinue = () => {
    exitZone(null);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-[80] bg-lantern-dark/95 border-t border-lantern-moss/30 rounded-t-3xl px-6 py-6"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-1 bg-lantern-parchment/20 rounded-full" />
        <h2 className="text-lg font-display font-bold text-lantern-moss tracking-wider uppercase">
          {t('zoneCleared', { zone: state.currentZone })}
        </h2>

        {state.pendingSkillBonuses > 0 && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-lantern-parchment/70 font-body">
              {t('chooseBonus', { remaining: state.pendingSkillBonuses })}
            </p>
            <div className="flex gap-2">
              {(['criticalHit', 'counterAttack', 'magicSpell', 'constitution'] as StatKey[]).map(key => {
                const a = state.abilities[key];
                const atMax = a.total >= MAX_CIRCLES;
                return (
                  <motion.button
                    key={key}
                    whileTap={!atMax ? { scale: 0.95 } : undefined}
                    onClick={() => !atMax && handleBonus(key)}
                    disabled={atMax}
                    className={`px-4 py-2 rounded-lg border font-display text-xs font-bold uppercase tracking-wider transition-all ${
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
          </div>
        )}

        {state.pendingSkillBonuses === 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="bg-lantern-gold text-lantern-dark px-10 py-2.5 font-display font-black rounded-full hover:bg-white transition-all shadow-lg text-sm uppercase tracking-[0.2em]"
          >
            {state.currentZone === 8 ? t('seeResults') : t('nextZone')}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
