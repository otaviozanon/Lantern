import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';

export const BonfireOverlay: React.FC = () => {
  const { state, handleBonfire } = useGame();
  const { t } = useLanguage();
  if (state.phase !== 'BONFIRE') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-lantern-dark/98 flex flex-col items-center justify-center gap-6 p-6"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Flame className="w-16 h-16 text-lantern-ember" />
      </motion.div>

      <h2 className="text-2xl font-display font-black text-lantern-gold tracking-[0.2em] uppercase">
        {t('theBonfire')}
      </h2>

      <p className="text-sm text-lantern-parchment/60 font-body text-center max-w-xs">
        {t('bonfireDesc')}
      </p>

      <div className="flex flex-col items-center gap-2 text-sm font-mono">
        <span className="text-lantern-parchment/40">{t('scrollExperience')}</span>
        <span className="text-2xl text-lantern-gold font-bold">{state.scrollExperience}</span>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleBonfire}
        className="bg-lantern-ember text-white px-10 py-3 font-display font-black rounded-full hover:bg-red-500 transition-all shadow-xl text-sm uppercase tracking-[0.2em]"
      >
        {t('restContinue')}
      </motion.button>
    </motion.div>
  );
};
