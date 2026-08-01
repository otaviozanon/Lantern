import { useState, useCallback } from 'react';
import { GameState, GamePhase, StatKey } from '../types/game';
import { MAX_CIRCLES, SETUP_REROLL_THRESHOLD } from '../constants/game';
import { rollDice, oppositeFace, adjustValue, diceSum } from '../utils/diceUtils';
import { checkZoneMatch, getExperienceLinesCompleted, getScore, getTitle } from '../utils/gameUtils';

function createInitialState(): GameState {
  return {
    phase: 'SETUP',
    currentZone: 1,
    clearedZones: Array(16).fill(false),
    dice: [],
    abilities: {
      criticalHit: { available: 0, total: 0 },
      counterAttack: { available: 0, total: 0 },
      magicSpell: { available: 0, total: 0 },
      constitution: { available: 0, total: 0 },
    },
    experience: 0,
    experienceLinesCompleted: 0,
    scrollExperience: 0,
    setupDiceValues: [],
    assignedSetup: { criticalHit: 0, counterAttack: 0, magicSpell: 0, constitution: 0, experience: 0, scroll: 0 },
    pendingSkillBonuses: 0,
    rerollAvailable: false,
    winner: null,
  };
}

export function useLantern() {
  const [state, setState] = useState<GameState>(createInitialState);

  const rollSetup = useCallback(() => {
    const dice = rollDice(6);
    const sum = diceSum(dice);
    setState(prev => ({
      ...prev,
      setupDiceValues: dice.map(d => d.value),
      dice,
      rerollAvailable: sum < SETUP_REROLL_THRESHOLD,
      assignedSetup: { criticalHit: 0, counterAttack: 0, magicSpell: 0, constitution: 0, experience: 0, scroll: 0 },
    }));
  }, []);

  const assignSetupDie = useCallback((slot: keyof GameState['assignedSetup'], value: number) => {
    setState(prev => ({
      ...prev,
      assignedSetup: { ...prev.assignedSetup, [slot]: value },
    }));
  }, []);

  const confirmSetup = useCallback(() => {
    setState(prev => {
      const a = prev.assignedSetup;
      const abilities = {
        criticalHit: { available: Math.min(a.criticalHit, MAX_CIRCLES), total: Math.min(a.criticalHit, MAX_CIRCLES) },
        counterAttack: { available: Math.min(a.counterAttack, MAX_CIRCLES), total: Math.min(a.counterAttack, MAX_CIRCLES) },
        magicSpell: { available: Math.min(a.magicSpell, MAX_CIRCLES), total: Math.min(a.magicSpell, MAX_CIRCLES) },
        constitution: { available: Math.min(a.constitution, MAX_CIRCLES), total: Math.min(a.constitution, MAX_CIRCLES) },
      };
      return {
        ...prev,
        abilities,
        experience: Math.min(a.experience, 12),
        experienceLinesCompleted: getExperienceLinesCompleted(Math.min(a.experience, 12)),
        scrollExperience: Math.min(a.scroll, 7),
        phase: 'ZONE_ENTRY',
      };
    });
  }, []);

  const enterZone = useCallback(() => {
    setState(prev => {
      const newDice = rollDice(6);
      const onesCount = newDice.filter(d => d.value === 1).length;
      const newExp = prev.experience + onesCount;

      const match = checkZoneMatch(newDice.map(d => d.value), prev.currentZone);

      const hasCircles =
        prev.abilities.criticalHit.available > 0 ||
        prev.abilities.counterAttack.available > 0 ||
        prev.abilities.magicSpell.available > 0 ||
        prev.abilities.constitution.available > 0;

      let newPhase: GamePhase;
      if (!hasCircles) {
        newPhase = 'GAME_OVER';
      } else {
        newPhase = 'FIGHTING';
      }

      const linesBefore = getExperienceLinesCompleted(prev.experience);
      const linesAfter = getExperienceLinesCompleted(newExp);

      return {
        ...prev,
        dice: newDice,
        experience: newExp,
        experienceLinesCompleted: linesAfter,
        pendingSkillBonuses: prev.pendingSkillBonuses + (linesAfter - linesBefore),
        phase: newPhase,
        winner: newPhase === 'GAME_OVER' ? false : prev.winner,
      };
    });
  }, []);

  const toggleDiceSelection = useCallback((diceId: string) => {
    setState(prev => ({
      ...prev,
      dice: prev.dice.map(d =>
        d.id === diceId ? { ...d, selected: !d.selected } : d
      ),
    }));
  }, []);

  const useCriticalHit = useCallback(() => {
    setState(prev => {
      if (prev.abilities.criticalHit.available <= 0) return prev;
      const selected = prev.dice.find(d => d.selected);
      if (!selected) return prev;

      const newValue = oppositeFace(selected.value);
      const ones = newValue === 1 ? 1 : 0;

      const newDice = prev.dice.map(d =>
        d.id === selected.id ? { ...d, value: newValue, selected: false } : d
      );
      const newAbilities = {
        ...prev.abilities,
        criticalHit: { ...prev.abilities.criticalHit, available: prev.abilities.criticalHit.available - 1 },
      };
      const comboMet = checkZoneMatch(newDice.map(d => d.value), prev.currentZone);
      const hasCircles =
        newAbilities.criticalHit.available > 0 ||
        newAbilities.counterAttack.available > 0 ||
        newAbilities.magicSpell.available > 0 ||
        newAbilities.constitution.available > 0;
      let newPhase: GamePhase = prev.phase;
      if (!hasCircles && !comboMet) newPhase = 'GAME_OVER';

      return {
        ...prev,
        dice: newDice,
        abilities: newAbilities,
        experience: prev.experience + ones,
        phase: newPhase,
        winner: newPhase === 'GAME_OVER' ? false : prev.winner,
      };
    });
  }, []);

  const useCounterAttack = useCallback((delta: 1 | -1) => {
    setState(prev => {
      if (prev.abilities.counterAttack.available <= 0) return prev;
      const selected = prev.dice.find(d => d.selected);
      if (!selected) return prev;

      const newValue = adjustValue(selected.value, delta);
      const ones = newValue === 1 ? 1 : 0;

      const newDice = prev.dice.map(d =>
        d.id === selected.id ? { ...d, value: newValue, selected: false } : d
      );
      const newAbilities = {
        ...prev.abilities,
        counterAttack: { ...prev.abilities.counterAttack, available: prev.abilities.counterAttack.available - 1 },
      };
      const comboMet = checkZoneMatch(newDice.map(d => d.value), prev.currentZone);
      const hasCircles =
        newAbilities.criticalHit.available > 0 ||
        newAbilities.counterAttack.available > 0 ||
        newAbilities.magicSpell.available > 0 ||
        newAbilities.constitution.available > 0;
      let newPhase: GamePhase = prev.phase;
      if (!hasCircles && !comboMet) newPhase = 'GAME_OVER';

      return {
        ...prev,
        dice: newDice,
        abilities: newAbilities,
        experience: prev.experience + ones,
        phase: newPhase,
        winner: newPhase === 'GAME_OVER' ? false : prev.winner,
      };
    });
  }, []);

  const useMagicSpell = useCallback(() => {
    setState(prev => {
      if (prev.abilities.magicSpell.available <= 0) return prev;
      const selected = prev.dice.find(d => d.selected);
      if (!selected) return prev;

      const newValue = Math.floor(Math.random() * 6) + 1;
      const ones = newValue === 1 ? 1 : 0;

      const newDice = prev.dice.map(d =>
        d.id === selected.id ? { ...d, value: newValue, selected: false } : d
      );
      const newAbilities = {
        ...prev.abilities,
        magicSpell: { ...prev.abilities.magicSpell, available: prev.abilities.magicSpell.available - 1 },
      };
      const comboMet = checkZoneMatch(newDice.map(d => d.value), prev.currentZone);
      const hasCircles =
        newAbilities.criticalHit.available > 0 ||
        newAbilities.counterAttack.available > 0 ||
        newAbilities.magicSpell.available > 0 ||
        newAbilities.constitution.available > 0;
      let newPhase: GamePhase = prev.phase;
      if (!hasCircles && !comboMet) newPhase = 'GAME_OVER';

      return {
        ...prev,
        dice: newDice,
        abilities: newAbilities,
        experience: prev.experience + ones,
        phase: newPhase,
        winner: newPhase === 'GAME_OVER' ? false : prev.winner,
      };
    });
  }, []);

  const useConstitution = useCallback(() => {
    setState(prev => {
      if (prev.abilities.constitution.available <= 0) return prev;
      const selectedIds = prev.dice.filter(d => d.selected).map(d => d.id);
      if (selectedIds.length === 0) return prev;

      let onesCount = 0;
      const newDice = prev.dice.map(d => {
        if (!selectedIds.includes(d.id)) return d;
        const newValue = Math.floor(Math.random() * 6) + 1;
        if (newValue === 1) onesCount++;
        return { ...d, value: newValue, selected: true };
      });

      const newAbilities = {
        ...prev.abilities,
        constitution: { ...prev.abilities.constitution, available: prev.abilities.constitution.available - 1 },
      };
      const comboMet = checkZoneMatch(newDice.map(d => d.value), prev.currentZone);
      const hasCircles =
        newAbilities.criticalHit.available > 0 ||
        newAbilities.counterAttack.available > 0 ||
        newAbilities.magicSpell.available > 0 ||
        newAbilities.constitution.available > 0;
      let newPhase: GamePhase = prev.phase;
      if (!hasCircles && !comboMet) newPhase = 'GAME_OVER';

      return {
        ...prev,
        dice: newDice,
        abilities: newAbilities,
        experience: prev.experience + onesCount,
        phase: newPhase,
        winner: newPhase === 'GAME_OVER' ? false : prev.winner,
      };
    });
  }, []);

  const confirmCombo = useCallback(() => {
    setState(prev => {
      const linesNow = getExperienceLinesCompleted(prev.experience);
      const newBonuses = Math.max(0, linesNow - prev.experienceLinesCompleted);
      return {
        ...prev,
        experienceLinesCompleted: linesNow,
        pendingSkillBonuses: prev.pendingSkillBonuses + newBonuses,
        phase: (prev.currentZone === 15 ? 'VICTORY' : 'ZONE_EXIT') as GamePhase,
        winner: prev.currentZone === 15 ? true : prev.winner,
      };
    });
  }, []);

  const exitZone = useCallback((bonusTarget: StatKey | null) => {
    setState(prev => {
      const newCleared = [...prev.clearedZones];
      newCleared[prev.currentZone] = true;

      let newExperienceLinesCompleted = prev.experienceLinesCompleted;
      let newPending = prev.pendingSkillBonuses;

      if (bonusTarget && newPending > 0) {
        const newAbilities = { ...prev.abilities };
        newAbilities[bonusTarget] = {
          ...newAbilities[bonusTarget],
          available: Math.min(newAbilities[bonusTarget].available + 1, MAX_CIRCLES),
          total: Math.min(newAbilities[bonusTarget].total + 1, MAX_CIRCLES),
        };
        newPending--;

        if (prev.currentZone === 15) {
          return {
            ...prev,
            clearedZones: newCleared,
            abilities: newAbilities,
            pendingSkillBonuses: newPending,
            phase: 'VICTORY',
            winner: true,
          };
        }

        if (newPending === 0) {
          const nextZone = Math.min(prev.currentZone + 1, 15);
          const isBonfire = nextZone === 5 || nextZone === 10;
          return {
            ...prev,
            clearedZones: newCleared,
            abilities: newAbilities,
            pendingSkillBonuses: newPending,
            experienceLinesCompleted: newExperienceLinesCompleted,
            currentZone: nextZone,
            phase: isBonfire ? 'BONFIRE' : 'ZONE_ENTRY',
          };
        }

        return {
          ...prev,
          clearedZones: newCleared,
          abilities: newAbilities,
          pendingSkillBonuses: newPending,
          experienceLinesCompleted: newExperienceLinesCompleted,
        };
      }

      if (newPending === 0) {
        if (prev.currentZone === 15) {
          return {
            ...prev,
            clearedZones: newCleared,
            phase: 'VICTORY',
            winner: true,
          };
        }
        const nextZone = Math.min(prev.currentZone + 1, 15);
        const isBonfire = nextZone === 5 || nextZone === 10;
        return {
          ...prev,
          clearedZones: newCleared,
          currentZone: nextZone,
          pendingSkillBonuses: 0,
          experienceLinesCompleted: newExperienceLinesCompleted,
          phase: isBonfire ? 'BONFIRE' : 'ZONE_ENTRY',
        };
      }

      return {
        ...prev,
        clearedZones: newCleared,
        experienceLinesCompleted: newExperienceLinesCompleted,
      };
    });
  }, []);

  const handleBonfire = useCallback(() => {
    setState(prev => {
      const newConstitution = Math.min(prev.abilities.constitution.available + 1, MAX_CIRCLES);
      const newExperience = Math.min(prev.scrollExperience, 12);
      const newLinesCompleted = getExperienceLinesCompleted(newExperience);

      return {
        ...prev,
        abilities: {
          ...prev.abilities,
          constitution: {
            ...prev.abilities.constitution,
            available: newConstitution,
            total: Math.min(prev.abilities.constitution.total + 1, MAX_CIRCLES),
          },
        },
        experience: newExperience,
        experienceLinesCompleted: newLinesCompleted,
        pendingSkillBonuses: prev.pendingSkillBonuses,
        phase: 'ZONE_EXIT',
      };
    });
  }, []);

  const restart = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    state,
    rollSetup,
    assignSetupDie,
    confirmSetup,
    enterZone,
    toggleDiceSelection,
    useCriticalHit,
    useCounterAttack,
    useMagicSpell,
    useConstitution,
    confirmCombo,
    exitZone,
    handleBonfire,
    restart,
    getScore: () => getScore(state),
    getTitle: () => getTitle(getScore(state)),
  };
}
