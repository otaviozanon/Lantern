import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useLanguage } from '../hooks/useLanguage';
import { ZONE_NAMES } from '../constants/game';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-lantern-dark/98 overflow-y-auto py-8 px-4"
    >
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-black text-lantern-gold tracking-wider uppercase">
            {t('rulesTitle')}
          </h2>
          <button onClick={onClose} className="text-lantern-parchment/40 hover:text-lantern-parchment">
            <Icon icon="pixelarticons:close" className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5 font-body text-lantern-parchment/80 text-sm leading-relaxed">
          <section>
            <h3 className="text-lantern-gold font-display font-bold text-base mb-2">{t('rulesSetup')}</h3>
            <p>{t('rulesSetupText')}</p>
          </section>

          <section>
            <h3 className="text-lantern-gold font-display font-bold text-base mb-2">{t('rulesAbilities')}</h3>
            <ul className="space-y-1.5 pl-4 list-disc">
              <li>{t('rulesCriticalHit')}</li>
              <li>{t('rulesCounterAttack')}</li>
              <li>{t('rulesMagicSpell')}</li>
              <li>{t('rulesConstitution')}</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lantern-gold font-display font-bold text-base mb-2">{t('rulesExperience')}</h3>
            <p>{t('rulesExpText')}</p>
          </section>

          <section>
            <h3 className="text-lantern-gold font-display font-bold text-base mb-2">{t('rulesZones')}</h3>
            <ul className="space-y-1 pl-4 list-disc">
              <li>Zona 1: 2, 3, 4 + 3 dados quaisquer</li>
              <li>Zona 2: 2, 3, 4 + 3 dados quaisquer</li>
              <li>Zona 3: 3, 4, 5 + 3 dados quaisquer</li>
              <li>Zona 4: Full House (3+3 iguais)</li>
              <li>Zona 5: A Fogueira (especial)</li>
              <li>Zona 6: 2, 3, 4 + 3 dados quaisquer</li>
              <li>Zona 7: 4, 5, 6 + 3 dados quaisquer</li>
              <li>Zona 8: Sexteto (6 dados idênticos)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lantern-gold font-display font-bold text-base mb-2">{t('rulesCombat')}</h3>
            <p>{t('rulesCombatText')}</p>
          </section>

          <section>
            <h3 className="text-lantern-gold font-display font-bold text-base mb-2">{t('rulesZone5')}</h3>
            <p>{t('rulesZone5Text')}</p>
          </section>

          <section>
            <h3 className="text-lantern-gold font-display font-bold text-base mb-2">{t('rulesScoring')}</h3>
            <p>{t('rulesScoringText')}</p>
          </section>

          <div className="flex justify-center pt-4 pb-8">
            <button
              onClick={onClose}
              className="bg-lantern-gold text-lantern-dark px-8 py-2 font-display font-bold rounded-full hover:bg-white transition-all text-sm uppercase tracking-wider"
            >
              {t('rulesClose')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
