import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { getScore, getTitle } from '../utils/gameUtils';

export const ResultOverlay: React.FC = () => {
  const { state, restart } = useGame();
  const { t } = useLanguage();
  if (state.phase !== 'GAME_OVER' && state.phase !== 'VICTORY') return null;

  const score = getScore(state);
  const title = getTitle(score);
  const isVictory = state.phase === 'VICTORY';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-lantern-dark/98 flex flex-col items-center justify-center z-[200] gap-6 p-6"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-[10px] text-lantern-parchment/20 uppercase font-black tracking-[0.4em]">
          {isVictory ? t('victory') : t('gameOver')}
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-black gold-shimmer uppercase text-center px-4">
          {isVictory ? t('dragonDefeated') : t('darknessConsumes')}
        </h2>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
          {t('adventureScore')}
        </span>
        <span className="text-4xl font-mono font-bold text-lantern-gold">{score}</span>
        <span className="text-sm font-body text-lantern-parchment/60 italic">{title}</span>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.95 }}
        onClick={restart}
        className="bg-lantern-gold text-lantern-dark px-12 py-4 font-display font-black rounded-full hover:bg-white active:scale-95 transition-all shadow-2xl text-sm uppercase tracking-[0.3em] cursor-pointer"
      >
        {t('newAdventure')}
      </motion.button>
    </motion.div>
  );
};
