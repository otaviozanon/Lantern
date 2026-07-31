import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { DiceComponent } from './Dice';
import { diceSum } from '../utils/diceUtils';
import { SETUP_REROLL_THRESHOLD } from '../constants/game';
import { GameState } from '../types/game';

const SETUP_SLOTS: { key: keyof GameState['assignedSetup']; labelKey: string }[] = [
  { key: 'criticalHit', labelKey: 'criticalHit' },
  { key: 'counterAttack', labelKey: 'counterAttack' },
  { key: 'magicSpell', labelKey: 'magicSpell' },
  { key: 'constitution', labelKey: 'constitution' },
  { key: 'experience', labelKey: 'experience' },
  { key: 'scroll', labelKey: 'bonfireScroll' },
];

export const SetupOverlay: React.FC = () => {
  const { state, rollSetup, assignSetupDie, confirmSetup } = useGame();
  const { t } = useLanguage();
  const [selectedDieValue, setSelectedDieValue] = useState<number | null>(null);
  const [selectedDieIndex, setSelectedDieIndex] = useState<number | null>(null);
  const [assignedIndices, setAssignedIndices] = useState<Set<number>>(new Set());

  if (state.phase !== 'SETUP') return null;

  const sum = diceSum(state.dice);
  const allAssigned = Object.values(state.assignedSetup).every(v => v > 0);

  const handleDieClick = (index: number) => {
    if (!assignedIndices.has(index)) {
      setSelectedDieValue(state.dice[index].value);
      setSelectedDieIndex(index);
    }
  };

  const handleSlotClick = (key: keyof GameState['assignedSetup']) => {
    if (selectedDieValue !== null && selectedDieIndex !== null && state.assignedSetup[key] === 0) {
      assignSetupDie(key, selectedDieValue);
      setAssignedIndices(prev => new Set(prev).add(selectedDieIndex));
      setSelectedDieValue(null);
      setSelectedDieIndex(null);
    }
  };

  const handleUndo = (key: keyof GameState['assignedSetup']) => {
    if (state.assignedSetup[key] > 0) {
      const value = state.assignedSetup[key];
      const idx = state.dice.findIndex(
        (_, i) => assignedIndices.has(i) && state.dice[i].value === value
      );
      if (idx !== -1) {
        setAssignedIndices(prev => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
      }
      assignSetupDie(key, 0);
      setSelectedDieValue(null);
      setSelectedDieIndex(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-lantern-dark/95 flex flex-col items-center justify-center gap-6 p-6"
    >
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-display font-black text-lantern-gold gold-shimmer tracking-[0.2em] uppercase">
          {t('gameTitle')}
        </h1>
        <p className="text-sm text-lantern-parchment/50 font-body italic">
          {t('assignDestiny')}
        </p>
      </div>

      <div className="flex gap-3">
        {state.dice.map((d, i) => {
          const assigned = assignedIndices.has(i);
          return (
            <div key={i} className="relative">
              <DiceComponent
                dice={d}
                onClick={() => handleDieClick(i)}
                className={clsx(
                  assigned && 'opacity-30 pointer-events-none',
                  selectedDieIndex === i && 'ring-2 ring-lantern-gold'
                )}
              />
            </div>
          );
        })}
      </div>

      {sum < SETUP_REROLL_THRESHOLD && state.dice.length === 6 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={rollSetup}
          className="px-4 py-2 text-xs font-display font-bold text-lantern-ember border border-lantern-ember/30 rounded-full hover:bg-lantern-ember/10 transition-all uppercase tracking-[0.2em]"
        >
          {t('sumReroll', { sum, threshold: SETUP_REROLL_THRESHOLD })}
        </motion.button>
      )}

      <div className="grid grid-cols-3 gap-3 max-w-xs w-full">
        {SETUP_SLOTS.map(slot => (
          <motion.button
            key={slot.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => state.assignedSetup[slot.key] > 0 ? handleUndo(slot.key) : handleSlotClick(slot.key)}
            className={clsx(
              'p-3 rounded-xl border text-center transition-all min-h-[70px] flex flex-col items-center justify-center gap-1',
              state.assignedSetup[slot.key] > 0
                ? 'bg-lantern-bronze/20 border-lantern-gold/50'
                : selectedDieValue !== null
                ? 'border-dashed border-lantern-parchment/20 hover:border-lantern-bronze/50 cursor-pointer'
                : 'border-dashed border-lantern-parchment/10 opacity-50'
            )}
          >
            <span className="text-[10px] font-display font-bold text-lantern-parchment/70 tracking-wider leading-tight">
              {t(slot.labelKey as any)}
            </span>
            {state.assignedSetup[slot.key] > 0 ? (
              <span className="text-lg font-mono font-bold text-lantern-gold">
                {state.assignedSetup[slot.key]}
              </span>
            ) : (
              <span className="text-lg text-lantern-parchment/20">—</span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {allAssigned && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={confirmSetup}
            className="bg-lantern-gold text-lantern-dark px-12 py-3 font-display font-black rounded-full hover:bg-white active:scale-95 transition-all shadow-2xl text-sm uppercase tracking-[0.3em]"
          >
            {t('beginJourney')}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
