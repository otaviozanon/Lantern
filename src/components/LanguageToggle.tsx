import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageToggle: React.FC = () => {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleLang}
      className="fixed top-12 right-4 z-[300] px-3 py-1.5 bg-lantern-gold/20 border-2 border-lantern-gold/30 text-xs font-mono font-bold text-lantern-parchment hover:bg-lantern-gold/30 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
      title={t('language')}
    >
      {lang.toUpperCase()}
    </motion.button>
  );
};
