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

  if (phase === 'SETUP' || phase === 'GAME_OVER' || phase === 'VICTORY') return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
      {/* Zone info */}
      <div className="flex flex-col">
        <span className="text-[10px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
          {t('zone')}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentZone}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-xl font-display font-bold text-lantern-gold"
          >
            {currentZone} — {t(`zone${currentZone}` as any)}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        {/* Circles counter */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
            {t('circles')}
          </span>
          <motion.span
            key={totalCircles}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-xl font-mono font-bold text-lantern-parchment"
          >
            {totalCircles}
          </motion.span>
        </div>
        {/* Bonfire indicator */}
        <AnimatePresence>
          {currentZone === 5 && phase !== 'BONFIRE' && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Icon icon="pixelarticons:fire" className="w-5 h-5 text-lantern-ember animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
