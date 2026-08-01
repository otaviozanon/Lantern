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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 p-4" style={{ background: '#0a0a1a' }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.bouncy, delay: 0.1 }}
        className="flex flex-col items-center gap-1"
      >
        <motion.h1
          className="text-3xl font-black text-[#ffd700] tracking-[0.2em] uppercase"
          animate={{ textShadow: ['0 0 8px rgba(255,215,0,0.3)', '0 0 20px rgba(255,215,0,0.6)', '0 0 8px rgba(255,215,0,0.3)'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          {t('gameTitle')}
        </motion.h1>
        <p className="text-sm text-[#666688] italic">
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
                  selectedDieIndex === i && '!ring-2 !ring-[#ffd700]'
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
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-3 gap-2 max-w-xs w-full">
        {SETUP_SLOTS.map((slot, i) => (
          <motion.button
            key={slot.key}
            variants={{ ...itemAnim, visible: { ...itemAnim.visible, transition: { ...springs.snappy, delay: 0.25 + i * 0.06 } } }}
            whileHover={!allAssigned ? { scale: 1.05 } : undefined}
            whileTap={{ scale: 0.95 }}
            onClick={() => state.assignedSetup[slot.key] > 0 ? handleUndo(slot.key) : handleSlotClick(slot.key)}
            className={clsx(
              'p-2.5 border-2 text-center min-h-[65px] flex flex-col items-center justify-center gap-0.5',
              state.assignedSetup[slot.key] > 0
                ? 'bg-[#12122a] border-[#ffd700]/50 shadow-[2px_2px_0px_#000]'
                : selectedDieValue !== null
                ? 'border-dashed border-[#e0e0e0]/20 hover:border-[#ffd700]/50 cursor-pointer'
                : 'border-dashed border-[#e0e0e0]/10 opacity-50'
            )}
          >
            <span className="text-[9px] font-bold text-[#e0e0e0]/70 tracking-wider leading-tight">
              {t(slot.labelKey as any)}
            </span>
            {state.assignedSetup[slot.key] > 0 ? (
              <motion.span
                key={state.assignedSetup[slot.key]}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={springs.bouncy}
                className="text-lg font-mono font-bold text-[#ffd700]"
              >
                {state.assignedSetup[slot.key]}
              </motion.span>
            ) : (
              <span className="text-lg text-[#e0e0e0]/20">—</span>
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
    </motion.div>
  );
};
