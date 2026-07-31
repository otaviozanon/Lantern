import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';

const flameParticles = Array.from({ length: 8 }, (_, i) => i);

export const BonfireOverlay: React.FC = () => {
  const { state, handleBonfire } = useGame();
  const { t } = useLanguage();
  if (state.phase !== 'BONFIRE') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 p-6 overflow-hidden" style={{ background: 'rgba(13,10,5,0.98)' }}
    >
      {/* Ambient flame particles */}
      {flameParticles.map(i => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-lantern-ember/40 rounded-full"
          initial={{
            x: `${40 + Math.random() * 20}%`,
            y: '60%',
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: `${10 + Math.random() * 20}%`,
            x: `${40 + (Math.random() - 0.5) * 40}%`,
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          filter: ['drop-shadow(0 0 8px rgba(217,78,60,0.6))', 'drop-shadow(0 0 24px rgba(217,78,60,0.9))', 'drop-shadow(0 0 8px rgba(217,78,60,0.6))'],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <Icon icon="pixelarticons:fire" className="w-20 h-20 text-lantern-ember" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-display font-black text-lantern-gold tracking-[0.2em] uppercase"
      >
        {t('theBonfire')}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-lantern-parchment/60 font-body text-center max-w-xs"
      >
        {t('bonfireDesc')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center gap-2 text-sm font-mono"
      >
        <span className="text-lantern-parchment/40">{t('scrollExperience')}</span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.7 }}
          className="text-3xl text-lantern-gold font-bold"
        >
          {state.scrollExperience}
        </motion.span>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.06, boxShadow: '0 0 20px rgba(217,78,60,0.5)' }}
        whileTap={{ scale: 0.94 }}
        onClick={handleBonfire}
        className="bg-lantern-ember text-white px-10 py-3 font-display font-black rounded-full transition-colors shadow-xl text-sm uppercase tracking-[0.2em]"
      >
        {t('restContinue')}
      </motion.button>
    </motion.div>
  );
};
