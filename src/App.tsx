import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
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

function App() {
  const { state, rollSetup } = useGame();
  const { t } = useLanguage();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (state.phase === 'SETUP' && state.dice.length === 0) {
      rollSetup();
    }
  }, [state.phase, state.dice.length, rollSetup]);

  return (
    <div className="h-screen w-screen parchment-bg flex flex-col items-center font-body selection:bg-lantern-bronze/30 overflow-hidden text-lantern-parchment">
      <HUD />
      <GameBoard />
      <CharacterSheet />

      <LanguageToggle />

      {/* Top-left action buttons */}
      <div className="fixed top-4 left-4 z-[300] flex gap-2">
        <button
          onClick={() => setShowRules(true)}
          className="px-3 py-1.5 rounded-full bg-lantern-bronze/20 border border-lantern-bronze/30 text-xs font-display font-bold text-lantern-parchment hover:bg-lantern-bronze/30 transition-all backdrop-blur-sm uppercase tracking-wider flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          {t('rules')}
        </button>
        <button
          onClick={() => setShowTutorial(true)}
          className="px-3 py-1.5 rounded-full bg-lantern-gold/20 border border-lantern-gold/30 text-xs font-display font-bold text-lantern-gold hover:bg-lantern-gold/30 transition-all backdrop-blur-sm uppercase tracking-wider flex items-center gap-1.5"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          {t('tutorial')}
        </button>
      </div>

      <AnimatePresence>
        {state.phase === 'SETUP' && <SetupOverlay key="setup" />}
        {state.phase === 'ZONE_ENTRY' && <ZoneEntryOverlay key="zone-entry" />}
        {state.phase === 'FIGHTING' && <FightOverlay key="fight" />}
        {state.phase === 'ZONE_EXIT' && <ZoneExitOverlay key="zone-exit" />}
        {state.phase === 'BONFIRE' && <BonfireOverlay key="bonfire" />}
        {(state.phase === 'GAME_OVER' || state.phase === 'VICTORY') && <ResultOverlay key="result" />}
        {showTutorial && <TutorialOverlay key="tutorial" onClose={() => setShowTutorial(false)} />}
        {showRules && <RulesModal key="rules" onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
