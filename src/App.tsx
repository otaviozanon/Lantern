import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useGame } from './hooks/useGame';
import { useLanguage } from './hooks/useLanguage';
import { GameBoard } from './components/GameBoard';
import { CharacterSheet } from './components/CharacterSheet';
import { HUD } from './components/HUD';
import { SetupOverlay } from './components/SetupOverlay';
import { ZoneEntryOverlay } from './components/ZoneEntryOverlay';
import { FightOverlay } from './components/FightOverlay';
import { ZoneExitOverlay } from './components/ZoneExitOverlay';
import { BonfireOverlay } from './components/BonfireOverlay';
import { ResultOverlay } from './components/ResultOverlay';
import { LanguageToggle } from './components/LanguageToggle';
import { TutorialOverlay } from './components/TutorialOverlay';
import { RulesModal } from './components/RulesModal';
import { useTooltips } from './hooks/useTooltips';

function App() {
  const { state, rollSetup } = useGame();
  const { t } = useLanguage();
  const { showTooltips, toggleTooltips } = useTooltips();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (state.phase === 'SETUP' && state.dice.length === 0) {
      rollSetup();
    }
  }, [state.phase, state.dice.length, rollSetup]);

  return (
    <div className="h-screen w-screen bg-[#0a0a1a] flex flex-col font-pixel selection:bg-[#ffd700]/30 overflow-hidden text-[#e0e0e0]">
      <LanguageToggle />

      <div className="fixed top-4 right-4 z-[300] flex gap-2">
        <button
          onClick={toggleTooltips}
          className={`px-3 py-1.5 border-2 text-xs font-bold transition-none uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
            showTooltips ? 'bg-[#00ff66]/20 border-[#00ff66]/30 text-[#00ff66]' : 'bg-[#12122a] border-[#2a2a4a] text-[#666688]'
          }`}
        >
          <Icon icon="pixelarticons:info-box" className="w-3.5 h-3.5" />
          {t('tips')}
        </button>
        <button
          onClick={() => setShowRules(true)}
          className="px-3 py-1.5 bg-[#ffd700]/20 border-2 border-[#ffd700]/30 text-xs font-bold text-[#e0e0e0] transition-none shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase tracking-wider flex items-center gap-1.5"
        >
          <Icon icon="pixelarticons:book-open" className="w-3.5 h-3.5" />
          {t('rules')}
        </button>
        <button
          onClick={() => setShowTutorial(true)}
          className="px-3 py-1.5 bg-[#ffd700]/20 border-2 border-[#ffd700]/30 text-xs font-bold text-[#ffd700] transition-none shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase tracking-wider flex items-center gap-1.5"
        >
          <Icon icon="pixelarticons:teach" className="w-3.5 h-3.5" />
          {t('tutorial')}
        </button>
      </div>

      <HUD />
      <GameBoard />

      <AnimatePresence mode="wait">
        {state.phase === 'ZONE_ENTRY' && <ZoneEntryOverlay key="zone-entry" />}
        {state.phase === 'FIGHTING' && <FightOverlay key="fight" />}
        {state.phase === 'ZONE_EXIT' && <ZoneExitOverlay key="zone-exit" />}
      </AnimatePresence>

      <CharacterSheet />

      <AnimatePresence>
        {state.phase === 'SETUP' && <SetupOverlay key="setup" />}
        {state.phase === 'BONFIRE' && <BonfireOverlay key="bonfire" />}
        {(state.phase === 'GAME_OVER' || state.phase === 'VICTORY') && <ResultOverlay key="result" />}
        {showTutorial && <TutorialOverlay key="tutorial" onClose={() => setShowTutorial(false)} />}
        {showRules && <RulesModal key="rules" onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
