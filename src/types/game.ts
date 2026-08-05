export type GamePhase =
  | 'SETUP'
  | 'ZONE_ENTRY'
  | 'FIGHTING'
  | 'ZONE_EXIT'
  | 'BONFIRE'
  | 'GAME_OVER'
  | 'VICTORY';

export type Difficulty = 'normal' | 'hard';

export type AbilityName = 'criticalHit' | 'counterAttack' | 'magicSpell';
export type StatKey = AbilityName | 'constitution';

export interface Dice {
  id: string;
  value: number;
  selected: boolean;
}

export interface AbilityCircle {
  available: number;
  total: number;
}

export interface GameState {
  phase: GamePhase;
  currentZone: number;
  clearedZones: boolean[];
  dice: Dice[];
  abilities: Record<StatKey, AbilityCircle>;
  experience: number;
  experienceLinesCompleted: number;
  scrollExperience: number;
  setupDiceValues: number[];
  assignedSetup: Record<StatKey | 'experience' | 'scroll', number>;
  pendingSkillBonuses: number;
  rerollAvailable: boolean;
  difficulty: Difficulty;
  winner: boolean | null;
}

export interface ZoneRequirement {
  fixed: number[];
  rule: 'fixed' | 'fullHouse' | 'sextet' | 'bonfire' | 'fixedWithGroup';
  groupSize?: number;
}


