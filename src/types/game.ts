export type GamePhase =
  | 'SETUP'
  | 'ZONE_ENTRY'
  | 'FIGHTING'
  | 'ZONE_EXIT'
  | 'BONFIRE'
  | 'GAME_OVER'
  | 'VICTORY';

export type AbilityName = 'criticalHit' | 'counterAttack' | 'magicSpell';
export type StatKey = AbilityName | 'constitution';

export const ABILITY_NAMES: AbilityName[] = ['criticalHit', 'counterAttack', 'magicSpell'];
export const STAT_KEYS: StatKey[] = ['criticalHit', 'counterAttack', 'magicSpell', 'constitution'];

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
  winner: boolean | null;
}

export interface ZoneRequirement {
  fixed: number[];
  rule: 'fixed' | 'fullHouse' | 'sextet' | 'bonfire';
}

export const SCORING_TIERS: { min: number; max: number; title: string }[] = [
  { min: 0, max: 0, title: 'Promising Adventurer' },
  { min: 1, max: 5, title: 'Master at Arms' },
  { min: 6, max: 15, title: 'Heroic Swashbuckler' },
  { min: 16, max: Infinity, title: 'Legendary Lantern Lord' },
];
