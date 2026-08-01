import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageToggle: React.FC = () => {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleLang}
      className="fixed top-12 right-4 z-[300] px-3 py-1.5 bg-[#ffd700]/20 border-2 border-[#ffd700]/30 text-xs font-mono font-bold text-[#e0e0e0] hover:bg-[#ffd700]/30 transition-all shadow-[2px_2px_0px_#000]"
      title={t('language')}
    >
      {lang.toUpperCase()}
    </motion.button>
  );
};
