import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { ZONE_NAMES } from '../constants/game';

export const ZoneEntryOverlay: React.FC = () => {
  const { state, enterZone } = useGame();
  if (state.phase !== 'ZONE_ENTRY') return null;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-[80] bg-lantern-dark/95 border-t border-lantern-bronze/20 rounded-t-3xl px-6 py-6 max-h-[65vh] overflow-y-auto scrollbar-hide"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-1 bg-lantern-parchment/20 rounded-full" />
        <h2 className="text-lg font-display font-bold text-lantern-gold tracking-wider uppercase">
          Zone {state.currentZone}: {ZONE_NAMES[state.currentZone]}
        </h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={enterZone}
          className="bg-lantern-bronze text-lantern-dark px-10 py-3 font-display font-black rounded-full hover:bg-lantern-gold transition-all shadow-xl text-sm uppercase tracking-[0.2em]"
        >
          Roll 6d6
        </motion.button>
      </div>
    </motion.div>
  );
};
