import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { DiceComponent } from './Dice';
import { GameTooltip } from './GameTooltip';
import { BitButton } from './8bit/BitButton';
import { diceSum } from '../utils/diceUtils';
import { SETUP_REROLL_THRESHOLD } from '../constants/game';
import { GameState } from '../types/game';

const SETUP_SLOTS: { key: keyof GameState['assignedSetup']; labelKey: string; descKey: string }[] = [
  { key: 'criticalHit', labelKey: 'criticalHit', descKey: 'flipDie' },
  { key: 'counterAttack', labelKey: 'counterAttack', descKey: 'addSubtract' },
  { key: 'magicSpell', labelKey: 'magicSpell', descKey: 'rerollOne' },
  { key: 'constitution', labelKey: 'constitution', descKey: 'rerollSelected' },
  { key: 'experience', labelKey: 'experience', descKey: 'expDesc' },
  { key: 'scroll', labelKey: 'bonfireScroll', descKey: 'scrollDesc' },
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
  const { state, rollSetup, assignSetupDie, confirmSetup, setDifficulty } = useGame();
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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 p-4 bg-lantern-dark"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.bouncy, delay: 0.1 }}
        className="flex flex-col items-center gap-1"
      >
        <motion.h1
          className="text-2xl sm:text-3xl font-black text-lantern-gold tracking-[0.2em] uppercase"
          animate={{ textShadow: ['0 0 8px rgba(255,215,0,0.3)', '0 0 20px rgba(255,215,0,0.6)', '0 0 8px rgba(255,215,0,0.3)'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          {t('gameTitle')}
        </motion.h1>
        <p className="font-pixel-sans text-lg text-lantern-parchment/30 italic">
        {t('assignDestiny')}
          </p>
        </motion.div>

        {/* Difficulty selector */}
        {state.dice.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="font-pixel-sans text-lg text-lantern-parchment/50 text-center">
              {t('difficultyQuestion')}
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setDifficulty('normal'); rollSetup(); }}
                className="px-8 py-4 border-2 border-lantern-moss/50 bg-lantern-moss/10 text-lantern-moss font-bold text-sm uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,0.4)] hover:bg-lantern-moss/20 hover:border-lantern-moss active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-none"
              >
                {t('difficultyNormal')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setDifficulty('hard'); rollSetup(); }}
                className="px-8 py-4 border-2 border-lantern-ember/50 bg-lantern-ember/10 text-lantern-ember font-bold text-sm uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,0.4)] hover:bg-lantern-ember/20 hover:border-lantern-ember active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-none"
              >
                {t('difficultyHard')}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Dice row */}
        {state.dice.length > 0 && (
        <>
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

      <div className="relative">
        {state.dice.length > 0 && <GameTooltip message={t('tooltipSetup' as any)} position="top" />}
      </div>

      {/* Reroll button */}
      <AnimatePresence>
        {sum < SETUP_REROLL_THRESHOLD && state.dice.length === 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <BitButton variant="red" size="sm" onClick={rollSetup}>
              {t('sumReroll', { sum, threshold: SETUP_REROLL_THRESHOLD })}
            </BitButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slots grid */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-2 max-w-sm w-full px-1">
        {SETUP_SLOTS.map((slot, i) => (
          <motion.button
            key={slot.key}
            variants={{ ...itemAnim, visible: { ...itemAnim.visible, transition: { ...springs.snappy, delay: 0.25 + i * 0.05 } } }}
            whileHover={!allAssigned ? { scale: 1.03 } : undefined}
            whileTap={{ scale: 0.97 }}
            onClick={() => state.assignedSetup[slot.key] > 0 ? handleUndo(slot.key) : handleSlotClick(slot.key)}
            className={clsx(
              'p-2 sm:p-3 border-2 text-center transition-colors min-h-[72px] sm:min-h-[80px] flex flex-col items-center justify-center gap-1',
              state.assignedSetup[slot.key] > 0
                ? 'bg-lantern-bronze/20 border-lantern-gold/50 shadow-[2px_2px_0px_rgba(0,0,0,0.4)]'
                : selectedDieValue !== null
                ? 'border-dashed border-lantern-parchment/20 hover:border-lantern-bronze/50 cursor-pointer bg-lantern-dark/80'
                : 'border-dashed border-lantern-parchment/10 opacity-50 bg-lantern-dark/80'
            )}
          >
            <span className="text-[10px] font-bold text-lantern-parchment/80 tracking-wider leading-tight">
              {t(slot.labelKey as any)}
            </span>
            <span className="font-pixel-sans text-[13px] text-lantern-parchment/25 leading-tight text-center">
              {t(slot.descKey as any)}
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
              <span className="text-lg text-lantern-parchment/10">—</span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Begin button */}
      <AnimatePresence>
        {allAssigned && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
          >
            <BitButton variant="gold" size="lg" onClick={confirmSetup}>{t('beginJourney')}</BitButton>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};
