import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { GameTooltip } from './GameTooltip';

export const ZoneEntryOverlay: React.FC = () => {
  const { state, enterZone } = useGame();
  const { t } = useLanguage();
  if (state.phase !== 'ZONE_ENTRY') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="shrink-0 border-t border-lantern-bronze/20 px-3 py-3" style={{ background: 'rgba(13,10,5,0.95)' }}
    >
      <div className="flex flex-col items-center gap-5">

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-display font-bold text-lantern-gold tracking-wider uppercase"
        >
          {t('zone')} {state.currentZone}
        </motion.h2>

        <div className="relative">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 24px rgba(201,125,63,0.4)' }}
            whileTap={{ scale: 0.94 }}
            onClick={enterZone}
            className="bg-lantern-bronze text-lantern-dark px-10 py-3 font-display font-black rounded-full transition-colors shadow-xl text-sm uppercase tracking-[0.2em]"
          >
            {t('roll6d6')}
          </motion.button>
          <GameTooltip message={t('tooltipEnterZone' as any)} position="top" />
        </div>
      </div>
    </motion.div>
  );
};
