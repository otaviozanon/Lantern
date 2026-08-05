import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { DiceTray } from './DiceTray';
import { AbilityButton } from './AbilityButton';
import { GameTooltip } from './GameTooltip';
import { BitProgress } from './8bit/BitProgress';
import { checkZoneMatch, getMatchProgress } from '../utils/gameUtils';
import { oppositeFace } from '../utils/diceUtils';

export const FightOverlay: React.FC = () => {
  const { state, toggleDiceSelection, useCriticalHit, useCounterAttack, useMagicSpell, useConstitution, confirmCombo } = useGame();
  const { t } = useLanguage();
  if (state.phase !== 'FIGHTING') return null;

  const values = state.dice.map(d => d.value);
  const match = checkZoneMatch(values, state.currentZone, state.difficulty);
  const progress = getMatchProgress(values, state.currentZone, state.difficulty);
  const selectedDie = state.dice.find(d => d.selected);
  const critPreview = selectedDie ? `${selectedDie.value} → ${oppositeFace(selectedDie.value)}` : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="shrink-0 border-t border-lantern-bronze/30 px-2 sm:px-3 py-2.5 max-h-[50vh] overflow-y-auto retro-scroll bg-lantern-dark"
    >
      <div className="flex flex-col items-center gap-3">

        {/* Match progress */}
        <BitProgress value={progress.matched} max={progress.required} color="green" label={t('matchProgress')} showValue className="w-full max-w-xs" />

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
                  <span className="text-[10px] font-bold text-lantern-parchment/70 tracking-wider">
                    {t('counter')}
                  </span>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={state.abilities.counterAttack.available <= 0}
                      onClick={() => useCounterAttack(-1)}
                      className="px-3 py-1.5 border-2 border-lantern-bronze/30 bg-lantern-dark/80 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:bg-lantern-dark/60 hover:border-lantern-gold/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                      -1
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={state.abilities.counterAttack.available <= 0}
                      onClick={() => useCounterAttack(1)}
                      className="px-3 py-1.5 border-2 border-lantern-bronze/30 bg-lantern-dark/80 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:bg-lantern-dark/60 hover:border-lantern-gold/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                      +1
                    </motion.button>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: state.abilities.counterAttack.total }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          backgroundColor: i < state.abilities.counterAttack.available ? '#e8c34b' : '#1a140c',
                          scale: i === state.abilities.counterAttack.available - 1 && state.abilities.counterAttack.available > 0 ? [1, 1.4, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-1.5 h-1.5"
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
                  description={key === 'criticalHit' ? t('flipDie') : key === 'magicSpell' ? t('rerollOne') : t('rerollSelected')}
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

        <div className="relative w-full flex justify-center">
          <GameTooltip message={t('tooltipFightAbilities' as any)} position="top" className="mt-2" />
        </div>

        {/* Zone cleared button */}
        {match && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: [1, 1.06, 1], y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 24px rgba(91,154,78,0.5)' }}
            whileTap={{ scale: 0.94 }}
            onClick={confirmCombo}
            className="bg-lantern-moss text-lantern-dark px-10 py-2.5 font-black transition-colors shadow-[3px_3px_0px_rgba(0,0,0,0.4)] border-2 border-lantern-moss/50 text-sm uppercase tracking-[0.2em]"
          >
            {t('zoneClearedButton')}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
