import { ZoneRequirement } from '../types/game';

export const MAX_CIRCLES = 7;
export const EXPERIENCE_LINES = [5, 4, 3];
export const TOTAL_EXPERIENCE_CIRCLES = 12;
export const SETUP_REROLL_THRESHOLD = 15;

export const ZONE_REQUIREMENTS: Record<number, ZoneRequirement> = {
  1: { fixed: [2, 3, 4], rule: 'fixed' },
  2: { fixed: [2, 3, 4], rule: 'fixed' },
  3: { fixed: [3, 4, 5], rule: 'fixed' },
  4: { fixed: [], rule: 'fullHouse' },
  5: { fixed: [], rule: 'bonfire' },
  6: { fixed: [2, 3, 4], rule: 'fixed' },
  7: { fixed: [4, 5, 6], rule: 'fixed' },
  8: { fixed: [], rule: 'sextet' },
};

export const ZONE_NAMES: Record<number, string> = {
  1: 'The Wolves',
  2: 'The Cultist',
  3: 'The Ruins',
  4: 'The Skeletons',
  5: 'The Bonfire',
  6: 'The Spider',
  7: 'The Tower',
  8: 'The Dragon',
};

export const ABILITY_LABELS: Record<string, string> = {
  criticalHit: 'Critical Hit',
  counterAttack: 'Counter-Attack',
  magicSpell: 'Magic Spell',
  constitution: 'Constitution',
};

export const ABILITY_DESCRIPTIONS: Record<string, string> = {
  criticalHit: 'Flip die to opposite face',
  counterAttack: 'Add or subtract 1',
  magicSpell: 'Reroll one die',
  constitution: 'Reroll selected dice',
};
