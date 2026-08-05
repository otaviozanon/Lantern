import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { Icon } from '@iconify/react';

export const HUD: React.FC = () => {
  const { state } = useGame();
  const { t } = useLanguage();
  const { phase, currentZone, abilities } = state;
  const totalCircles = Object.values(abilities).reduce((sum, a) => sum + a.available, 0);
  const shouldShow = phase !== 'SETUP' && phase !== 'GAME_OVER' && phase !== 'VICTORY';
  if (!shouldShow) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-14 pb-4 flex flex-col gap-2 pointer-events-none">
      <div className="flex flex-col">
        <span className="text-[8px] text-lantern-parchment/30 uppercase tracking-[0.3em]">
          {t('zone')}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentZone}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-base font-bold text-lantern-gold leading-tight"
          >
            {currentZone} — {t(`zone${currentZone}`)}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[8px] text-lantern-parchment/30 uppercase tracking-[0.3em]">
            {t('circles')}
          </span>
          <motion.span
            key={totalCircles}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-base font-mono font-bold text-lantern-parchment"
          >
            {totalCircles}
          </motion.span>
        </div>
        <AnimatePresence>
          {(currentZone === 5 || currentZone === 10) && phase !== 'BONFIRE' && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Icon icon="pixelarticons:fire" className="w-4 h-4 text-lantern-ember animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
