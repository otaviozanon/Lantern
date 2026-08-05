import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { getZoneRequirements } from '../constants/game';

interface RulesModalProps {
  onClose: () => void;
}

function formatZoneReq(zone: number, req: { fixed: number[]; rule: string; groupSize?: number }, t: (key: string) => string): string {
  const wc = 6 - req.fixed.length - (req.groupSize || 0);
  switch (req.rule) {
    case 'fixed': return `${req.fixed.join(', ')} + ${wc} ${t('reqAny')}`;
    case 'fixedWithGroup': return `${req.fixed.join(', ')} + ${req.groupSize} ${t('reqGroup')}`;
    case 'fullHouse': return t('reqFullHouse');
    case 'bonfire': return t('reqBonfire');
    case 'sextet': return t('reqSextet');
    default: return '';
  }
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { state } = useGame();
  const reqs = getZoneRequirements(state.difficulty);
  const zones = Object.keys(reqs).map(Number).sort((a, b) => a - b);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-lantern-dark/95"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-lantern-dark border-2 border-lantern-bronze/30 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] p-4 sm:p-6 max-w-lg w-[95vw] sm:w-full max-h-[80vh] overflow-y-auto retro-scroll"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-lantern-gold tracking-wider uppercase">
            {t('rulesTitle')}
          </h2>
          <button onClick={onClose} className="text-lantern-parchment/30 hover:text-lantern-parchment">
            <Icon icon="pixelarticons:close" className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5 text-lantern-parchment/80 text-sm leading-relaxed">
          <section>
            <h3 className="text-lantern-gold font-bold text-base mb-2">{t('rulesSetup')}</h3>
            <p className="font-pixel-sans text-lg">{t('rulesSetupText')}</p>
          </section>

          <section>
            <h3 className="text-lantern-gold font-bold text-base mb-2">{t('rulesAbilities')}</h3>
            <ul className="font-pixel-sans text-lg space-y-1.5 pl-4 list-disc">
              <li>{t('rulesCriticalHit')}</li>
              <li>{t('rulesCounterAttack')}</li>
              <li>{t('rulesMagicSpell')}</li>
              <li>{t('rulesConstitution')}</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lantern-gold font-bold text-base mb-2">{t('rulesExperience')}</h3>
            <p className="font-pixel-sans text-lg">{t('rulesExpText')}</p>
          </section>

          <section>
            <h3 className="text-lantern-gold font-bold text-base mb-2">{t('rulesZones')}</h3>
            <ul className="font-pixel-sans text-lg space-y-1 pl-4 list-disc">
              {zones.map(z => {
                const req = reqs[z];
                return <li key={z}>Zona {z}: {formatZoneReq(z, req, t)}</li>;
              })}
            </ul>
          </section>

          <section>
            <h3 className="text-lantern-gold font-bold text-base mb-2">{t('rulesCombat')}</h3>
            <p className="font-pixel-sans text-lg">{t('rulesCombatText')}</p>
          </section>

          <section>
            <h3 className="text-lantern-gold font-bold text-base mb-2">{t('rulesZone5')}</h3>
            <p className="font-pixel-sans text-lg">{t('rulesZone5Text')}</p>
          </section>

          <section>
            <h3 className="text-lantern-gold font-bold text-base mb-2">{t('rulesScoring')}</h3>
            <p className="font-pixel-sans text-lg">{t('rulesScoringText')}</p>
          </section>

          <div className="flex justify-center pt-4 pb-8">
            <button
              onClick={onClose}
              className="bg-lantern-gold text-lantern-dark px-8 py-2 font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.4)] border-2 border-lantern-gold/50 text-sm uppercase tracking-wider hover:bg-lantern-gold/80 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              {t('rulesClose')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
