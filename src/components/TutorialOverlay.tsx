import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useLanguage } from '../hooks/useLanguage';
import { TranslationKey } from '../i18n/translations';

const TUTORIAL_STEPS = [
  {
    icon: 'pixelarticons:book-open',
    titleKey: 'tutTitle1' as TranslationKey,
    bodyKey: 'tutBody1' as TranslationKey,
  },
  {
    icon: 'pixelarticons:dice',
    titleKey: 'tutTitle2' as TranslationKey,
    bodyKey: 'tutBody2' as TranslationKey,
  },
  {
    icon: 'pixelarticons:sword',
    titleKey: 'tutTitle3' as TranslationKey,
    bodyKey: 'tutBody3' as TranslationKey,
  },
  {
    icon: 'pixelarticons:magic-edit',
    titleKey: 'tutTitle4' as TranslationKey,
    bodyKey: 'tutBody4' as TranslationKey,
  },
  {
    icon: 'pixelarticons:fire',
    titleKey: 'tutTitle5' as TranslationKey,
    bodyKey: 'tutBody5' as TranslationKey,
  },
  {
    icon: 'pixelarticons:trophy',
    titleKey: 'tutTitle6' as TranslationKey,
    bodyKey: 'tutBody6' as TranslationKey,
  },
];

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const st = TUTORIAL_STEPS[step];

  const next = () => {
    if (step < TUTORIAL_STEPS.length - 1) setStep(s => s + 1);
    else onClose();
  };
  const prev = () => { if (step > 0) setStep(s => s - 1); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-6"
      style={{ background: 'rgba(13,10,5,0.98)' }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-lantern-parchment/40 hover:text-lantern-parchment z-10">
        <Icon icon="pixelarticons:close" className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {TUTORIAL_STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: i <= step ? '#e8c34b' : '#2a2015',
                scale: i === step ? 1.4 : 1,
                width: i === step ? 16 : 8,
              }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        <span className="text-[9px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
          {step + 1}/{TUTORIAL_STEPS.length}
        </span>

        {/* Content card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="flex flex-col items-center gap-4 text-center w-full"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 rounded-2xl bg-lantern-gold/10 border border-lantern-gold/20 flex items-center justify-center"
            >
              <Icon icon={st.icon} className="w-8 h-8 text-lantern-gold" />
            </motion.div>

            <h3 className="text-xl font-display font-black text-lantern-gold tracking-wider uppercase">
              {t(st.titleKey)}
            </h3>

            <p className="text-sm text-lantern-parchment/80 font-body leading-relaxed max-w-[280px]">
              {t(st.bodyKey)}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={prev}
            disabled={step === 0}
            className="p-2 rounded-full border border-lantern-parchment/20 text-lantern-parchment/60 hover:text-lantern-parchment hover:border-lantern-parchment/40 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <Icon icon="pixelarticons:chevron-left" className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            className="bg-lantern-gold text-lantern-dark px-10 py-2.5 font-display font-black rounded-full hover:bg-white active:scale-95 transition-all text-sm uppercase tracking-[0.2em] shadow-lg hover:shadow-xl"
          >
            {step === TUTORIAL_STEPS.length - 1 ? t('finishTutorial') : t('nextStep')}
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2 text-xs text-lantern-parchment/30 hover:text-lantern-parchment/60 font-body transition-colors"
          >
            {t('skipTutorial')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
