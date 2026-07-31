import React from 'react';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../hooks/useLanguage';
import { Flame } from 'lucide-react';

export const HUD: React.FC = () => {
  const { state } = useGame();
  const { t } = useLanguage();
  const { phase, currentZone, abilities } = state;
  const totalCircles = Object.values(abilities).reduce((sum, a) => sum + a.available, 0);

  if (phase === 'SETUP' || phase === 'GAME_OVER' || phase === 'VICTORY') return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
      <div className="flex flex-col">
        <span className="text-[10px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
          {t('zone')}
        </span>
        <span className="text-xl font-display font-bold text-lantern-gold">
          {currentZone} — {t(`zone${currentZone}` as any)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
            {t('circles')}
          </span>
          <span className="text-xl font-mono font-bold text-lantern-parchment">
            {totalCircles}
          </span>
        </div>
        {currentZone === 5 && phase !== 'BONFIRE' && (
          <Flame className="w-5 h-5 text-lantern-ember animate-pulse" />
        )}
      </div>
    </header>
  );
};
