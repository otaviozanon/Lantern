import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useGame } from '../hooks/useGame';

export const BonfireOverlay: React.FC = () => {
  const { state, handleBonfire } = useGame();
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
        The Bonfire
      </h2>

      <p className="text-sm text-lantern-parchment/60 font-body text-center max-w-xs">
        Rest and reflect. Gain +1 Constitution and reset your Experience.
      </p>

      <div className="flex flex-col items-center gap-2 text-sm font-mono">
        <span className="text-lantern-parchment/40">Scroll Experience:</span>
        <span className="text-2xl text-lantern-gold font-bold">{state.scrollExperience}</span>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleBonfire}
        className="bg-lantern-ember text-white px-10 py-3 font-display font-black rounded-full hover:bg-red-500 transition-all shadow-xl text-sm uppercase tracking-[0.2em]"
      >
        Rest & Continue
      </motion.button>
    </motion.div>
  );
};
