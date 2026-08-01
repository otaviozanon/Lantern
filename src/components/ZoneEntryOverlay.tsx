import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { GameTooltip } from './GameTooltip';
import { BitButton } from './8bit/BitButton';

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
      className="shrink-0 border-t border-[#2a2a4a] px-3 py-3" style={{ background: '#0a0a1a' }}
    >
      <div className="flex flex-col items-center gap-5">

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-bold text-[#ffd700] tracking-wider uppercase"
        >
          {t('zone')} {state.currentZone}
        </motion.h2>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <BitButton variant="gold" size="lg" onClick={enterZone}>{t('roll6d6')}</BitButton>
          </motion.div>
          <GameTooltip message={t('tooltipEnterZone' as any)} position="top" />
        </div>
      </div>
    </motion.div>
  );
};
