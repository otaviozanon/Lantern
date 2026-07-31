import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { GameBoard } from './components/GameBoard';
import { CharacterSheet } from './components/CharacterSheet';
import { HUD } from './components/HUD';
import { SetupOverlay } from './components/SetupOverlay';
import { ZoneEntryOverlay } from './components/ZoneEntryOverlay';
import { FightOverlay } from './components/FightOverlay';
import { ZoneExitOverlay } from './components/ZoneExitOverlay';
import { BonfireOverlay } from './components/BonfireOverlay';
import { ResultOverlay } from './components/ResultOverlay';

function App() {
  const { state, rollSetup } = useGame();

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

      <AnimatePresence>
        {state.phase === 'SETUP' && <SetupOverlay />}
        {state.phase === 'ZONE_ENTRY' && <ZoneEntryOverlay />}
        {state.phase === 'FIGHTING' && <FightOverlay />}
        {state.phase === 'ZONE_EXIT' && <ZoneExitOverlay />}
        {state.phase === 'BONFIRE' && <BonfireOverlay />}
        {(state.phase === 'GAME_OVER' || state.phase === 'VICTORY') && <ResultOverlay />}
      </AnimatePresence>
    </div>
  );
}

export default App;
