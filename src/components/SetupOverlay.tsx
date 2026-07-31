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

const springs = {
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
  snappy: { type: 'spring' as const, stiffness: 300, damping: 30 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springs.snappy },
};

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
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 p-4" style={{ background: 'rgba(13,10,5,0.95)' }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.bouncy, delay: 0.1 }}
        className="flex flex-col items-center gap-1"
      >
        <motion.h1
          className="text-3xl font-display font-black text-lantern-gold gold-shimmer tracking-[0.2em] uppercase"
          animate={{ textShadow: ['0 0 8px rgba(232,195,75,0.3)', '0 0 20px rgba(232,195,75,0.6)', '0 0 8px rgba(232,195,75,0.3)'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          {t('gameTitle')}
        </motion.h1>
        <p className="text-sm text-lantern-parchment/50 font-body italic">
          {t('assignDestiny')}
        </p>
      </motion.div>

      {/* Dice row */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="flex gap-3">
        {state.dice.map((d, i) => {
          const assigned = assignedIndices.has(i);
          return (
            <motion.div key={i} variants={itemAnim} className="relative">
              <DiceComponent
                dice={d}
                onClick={() => handleDieClick(i)}
                className={clsx(
                  assigned && 'opacity-30 pointer-events-none',
                  selectedDieIndex === i && '!ring-2 !ring-lantern-gold'
                )}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Reroll button */}
      <AnimatePresence>
        {sum < SETUP_REROLL_THRESHOLD && state.dice.length === 6 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rollSetup}
            className="px-4 py-2 text-xs font-display font-bold text-lantern-ember border border-lantern-ember/30 rounded-full hover:bg-lantern-ember/10 transition-colors uppercase tracking-[0.2em]"
          >
            {t('sumReroll', { sum, threshold: SETUP_REROLL_THRESHOLD })}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slots grid */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-3 gap-2 max-w-xs w-full">
        {SETUP_SLOTS.map((slot, i) => (
          <motion.button
            key={slot.key}
            variants={{ ...itemAnim, visible: { ...itemAnim.visible, transition: { ...springs.snappy, delay: 0.25 + i * 0.06 } } }}
            whileHover={!allAssigned ? { scale: 1.05 } : undefined}
            whileTap={{ scale: 0.95 }}
            onClick={() => state.assignedSetup[slot.key] > 0 ? handleUndo(slot.key) : handleSlotClick(slot.key)}
            className={clsx(
              'p-2.5 rounded-xl border text-center transition-colors min-h-[65px] flex flex-col items-center justify-center gap-0.5',
              state.assignedSetup[slot.key] > 0
                ? 'bg-lantern-bronze/20 border-lantern-gold/50 shadow-lg shadow-lantern-gold/5'
                : selectedDieValue !== null
                ? 'border-dashed border-lantern-parchment/20 hover:border-lantern-bronze/50 cursor-pointer'
                : 'border-dashed border-lantern-parchment/10 opacity-50'
            )}
          >
            <span className="text-[9px] font-display font-bold text-lantern-parchment/70 tracking-wider leading-tight">
              {t(slot.labelKey as any)}
            </span>
            {state.assignedSetup[slot.key] > 0 ? (
              <motion.span
                key={state.assignedSetup[slot.key]}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={springs.bouncy}
                className="text-lg font-mono font-bold text-lantern-gold"
              >
                {state.assignedSetup[slot.key]}
              </motion.span>
            ) : (
              <span className="text-lg text-lantern-parchment/20">—</span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Begin button */}
      <AnimatePresence>
        {allAssigned && (
          <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(232,195,75,0.3)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ ...springs.bouncy }}
            onClick={confirmSetup}
            className="bg-lantern-gold text-lantern-dark px-10 py-3 font-display font-black rounded-full transition-all shadow-xl text-sm uppercase tracking-[0.3em]"
          >
            {t('beginJourney')}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
