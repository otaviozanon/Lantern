import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { getScore, getTitle } from '../utils/gameUtils';

const springs = {
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
};

export const ResultOverlay: React.FC = () => {
  const { state, restart } = useGame();
  const { t } = useLanguage();
  const [displayScore, setDisplayScore] = useState(0);

  if (state.phase !== 'GAME_OVER' && state.phase !== 'VICTORY') return null;

  const score = getScore(state);
  const title = getTitle(score);
  const isVictory = state.phase === 'VICTORY';

  useEffect(() => {
    if (score > 0) {
      let start = 0;
      const step = Math.ceil(score / 40);
      const timer = setInterval(() => {
        start += step;
        if (start >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(start);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-lantern-dark/98 flex flex-col items-center justify-center z-[200] gap-8 p-6"
    >
      {/* Status label */}
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-[10px] text-lantern-parchment/20 uppercase font-black tracking-[0.4em]"
      >
        {isVictory ? t('victory') : t('gameOver')}
      </motion.span>

      {/* Title with character stagger */}
      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, ...springs.bouncy }}
        className="text-3xl md:text-5xl font-display font-black gold-shimmer uppercase text-center px-4"
      >
        {isVictory ? t('dragonDefeated') : t('darknessConsumes')}
      </motion.h2>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center gap-1"
      >
        <span className="text-[10px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
          {t('adventureScore')}
        </span>
        <motion.span
          key={displayScore}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-5xl font-mono font-bold text-lantern-gold"
        >
          {displayScore}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm font-body text-lantern-parchment/60 italic"
        >
          {title}
        </motion.span>
      </motion.div>

      {/* Restart button */}
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(232,195,75,0.3)' }}
        whileTap={{ scale: 0.94 }}
        onClick={restart}
        className="bg-lantern-gold text-lantern-dark px-12 py-4 font-display font-black rounded-full transition-colors shadow-2xl text-sm uppercase tracking-[0.3em] cursor-pointer"
      >
        {t('newAdventure')}
      </motion.button>
    </motion.div>
  );
};
