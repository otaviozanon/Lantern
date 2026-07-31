import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useLanguage } from '../hooks/useLanguage';
import { TranslationKey } from '../i18n/translations';

const TUTORIAL_STEPS: TranslationKey[] = [
  'tutorialSetup1',
  'tutorialSetup2',
  'tutorialSetup3',
  'tutorialSetup4',
  'tutorialSetup5',
  'tutorialSetup6',
  'tutorialSetup7',
];

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);

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
      className="fixed inset-0 z-[300] bg-lantern-dark/98 flex flex-col items-center justify-center p-6"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-lantern-parchment/40 hover:text-lantern-parchment">
        <Icon icon="pixelarticons:close" className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="flex gap-1">
          {TUTORIAL_STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ backgroundColor: i <= step ? '#e8c34b' : '#2a2015', scale: i === step ? 1.3 : 1 }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg text-lantern-parchment font-body leading-relaxed"
          >
            {t(TUTORIAL_STEPS[step])}
          </motion.p>
        </AnimatePresence>

        <div className="flex gap-4">
          <button
            onClick={prev}
            disabled={step === 0}
            className="p-2 rounded-full border border-lantern-parchment/20 text-lantern-parchment/60 hover:text-lantern-parchment disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <Icon icon="pixelarticons:chevron-left" className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="bg-lantern-gold text-lantern-dark px-8 py-2 font-display font-bold rounded-full hover:bg-white transition-all text-sm uppercase tracking-wider"
          >
            {step === TUTORIAL_STEPS.length - 1 ? t('finishTutorial') : t('nextStep')}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-lantern-parchment/40 hover:text-lantern-parchment font-body"
          >
            {t('skipTutorial')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
