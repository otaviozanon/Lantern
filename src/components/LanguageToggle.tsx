import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageToggle: React.FC = () => {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleLang}
      className="fixed top-4 right-4 z-[300] px-3 py-1.5 rounded-full bg-lantern-bronze/20 border border-lantern-bronze/30 text-xs font-mono font-bold text-lantern-parchment hover:bg-lantern-bronze/30 transition-all backdrop-blur-sm"
      title={t('language')}
    >
      {lang.toUpperCase()}
    </motion.button>
  );
};
