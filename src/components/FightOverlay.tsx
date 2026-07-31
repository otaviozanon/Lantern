import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { ABILITY_DESCRIPTIONS } from '../constants/game';
import { DiceTray } from './DiceTray';
import { AbilityButton } from './AbilityButton';
import { checkZoneMatch, getMatchProgress } from '../utils/gameUtils';
import { oppositeFace } from '../utils/diceUtils';

export const FightOverlay: React.FC = () => {
  const { state, toggleDiceSelection, useCriticalHit, useCounterAttack, useMagicSpell, useConstitution, confirmCombo } = useGame();
  const { t } = useLanguage();
  if (state.phase !== 'FIGHTING') return null;

  const values = state.dice.map(d => d.value);
  const match = checkZoneMatch(values, state.currentZone);
  const progress = getMatchProgress(values, state.currentZone);
  const selectedDie = state.dice.find(d => d.selected);
  const critPreview = selectedDie ? `${selectedDie.value} → ${oppositeFace(selectedDie.value)}` : undefined;

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.8 }}
      className="fixed bottom-0 left-0 right-0 z-[80] bg-lantern-dark/95 border-t border-lantern-bronze/20 rounded-t-3xl px-4 py-4 max-h-[70vh] overflow-y-auto scrollbar-hide"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-1 bg-lantern-parchment/20 rounded-full" />

        {/* Match progress */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs"
        >
          <div className="flex justify-between text-[10px] font-mono text-lantern-parchment/40 mb-1">
            <span>{t('matchProgress')}</span>
            <span>{progress.matched}/{progress.required}</span>
          </div>
          <div className="h-1.5 bg-lantern-dark rounded-full overflow-hidden border border-lantern-parchment/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: progress.required > 0 && progress.matched === progress.required ? '#5b9a4e' : '#c97d3f' }}
              animate={{
                width: progress.required > 0 ? `${(progress.matched / progress.required) * 100}%` : '0%',
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            />
          </div>
        </motion.div>

        {/* Dice */}
        <DiceTray dice={state.dice} onDiceClick={toggleDiceSelection} />

        {/* Abilities */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 w-full justify-center"
        >
          {(['criticalHit', 'counterAttack', 'magicSpell', 'constitution'] as const).map(key => (
            <React.Fragment key={key}>
              {key === 'counterAttack' ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-display font-bold text-lantern-parchment/70 tracking-wider">
                    {t('counter')}
                  </span>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={state.abilities.counterAttack.available <= 0}
                      onClick={() => useCounterAttack(-1)}
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      -1
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={state.abilities.counterAttack.available <= 0}
                      onClick={() => useCounterAttack(1)}
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      +1
                    </motion.button>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: state.abilities.counterAttack.total }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          backgroundColor: i < state.abilities.counterAttack.available ? '#c97d3f' : '#2a2015',
                          scale: i === state.abilities.counterAttack.available - 1 && state.abilities.counterAttack.available > 0 ? [1, 1.4, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-1.5 h-1.5 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-[8px] text-lantern-parchment/30 font-mono">
                    {state.abilities.counterAttack.available}/{state.abilities.counterAttack.total}
                  </span>
                </div>
              ) : (
                <AbilityButton
                  key={key}
                  name={key}
                  label={key === 'criticalHit' ? t('crit') : key === 'magicSpell' ? t('spell') : t('endure')}
                  description={ABILITY_DESCRIPTIONS[key]}
                  available={state.abilities[key].available}
                  total={state.abilities[key].total}
                  preview={key === 'criticalHit' ? critPreview : undefined}
                  onClick={() => {
                    if (key === 'criticalHit') useCriticalHit();
                    if (key === 'magicSpell') useMagicSpell();
                    if (key === 'constitution') useConstitution();
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Zone cleared button */}
        {match && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: [1, 1.06, 1], y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 24px rgba(91,154,78,0.5)' }}
            whileTap={{ scale: 0.94 }}
            onClick={confirmCombo}
            className="bg-lantern-moss text-lantern-dark px-10 py-2.5 font-display font-black rounded-full transition-colors shadow-lg text-sm uppercase tracking-[0.2em]"
          >
            {t('zoneClearedButton')}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
