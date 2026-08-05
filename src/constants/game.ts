import { ZoneRequirement, Difficulty } from "../types/game";

export const MAX_CIRCLES = 7;
export const EXPERIENCE_LINES = [5, 4, 3];
export const TOTAL_EXPERIENCE_CIRCLES = 12;
export const SETUP_REROLL_THRESHOLD = 15;

export function getZoneCount(difficulty: Difficulty): number {
  return difficulty === 'hard' ? 15 : 8;
}

export function getVictoryZone(difficulty: Difficulty): number {
  return difficulty === 'hard' ? 15 : 8;
}

export function getBonfireZones(difficulty: Difficulty): number[] {
  return difficulty === 'hard' ? [5, 10] : [5];
}

const ZONE_REQUIREMENTS_NORMAL: Record<number, ZoneRequirement> = {
  1: { fixed: [4, 5], rule: "fixed" },
  2: { fixed: [2, 3, 4], rule: "fixed" },
  3: { fixed: [3, 4, 5], rule: "fixed" },
  4: { fixed: [], rule: "fullHouse" },
  5: { fixed: [], rule: "bonfire" },
  6: { fixed: [2, 3, 4], rule: "fixedWithGroup", groupSize: 3 },
  7: { fixed: [4, 5, 6], rule: "fixed" },
  8: { fixed: [], rule: "sextet" },
};

const ZONE_REQUIREMENTS_HARD: Record<number, ZoneRequirement> = {
  1: { fixed: [4, 5], rule: "fixed" },
  2: { fixed: [2, 3, 4], rule: "fixed" },
  3: { fixed: [3, 4, 5], rule: "fixed" },
  4: { fixed: [4, 5, 6], rule: "fixed" },
  5: { fixed: [], rule: "bonfire" },
  6: { fixed: [2, 3, 4], rule: "fixedWithGroup", groupSize: 3 },
  7: { fixed: [3, 4, 5], rule: "fixedWithGroup", groupSize: 3 },
  8: { fixed: [], rule: "fullHouse" },
  9: { fixed: [4, 5, 6], rule: "fixedWithGroup", groupSize: 3 },
  10: { fixed: [], rule: "bonfire" },
  11: { fixed: [2, 4, 6], rule: "fixedWithGroup", groupSize: 3 },
  12: { fixed: [1, 2, 3, 4], rule: "fixed" },
  13: { fixed: [], rule: "fullHouse" },
  14: { fixed: [3, 4, 5, 6], rule: "fixedWithGroup", groupSize: 2 },
  15: { fixed: [], rule: "sextet" },
};

export function getZoneRequirements(difficulty: Difficulty): Record<number, ZoneRequirement> {
  return difficulty === 'hard' ? ZONE_REQUIREMENTS_HARD : ZONE_REQUIREMENTS_NORMAL;
}

const ZONE_NAMES_NORMAL: Record<number, string> = {
  1: "The Wolves",   2: "The Cultist",  3: "The Ruins",
  4: "The Skeletons", 5: "The Bonfire",  6: "The Spider",
  7: "The Tower",    8: "The Dragon",
};

const ZONE_NAMES_HARD: Record<number, string> = {
  1: "The Wolves",   2: "The Cultist",  3: "The Ruins",
  4: "The Skeletons", 5: "The Bonfire",  6: "The Spider",
  7: "The Tower",    8: "The Undead",   9: "The Golem",
  10: "The Campfire", 11: "The Demon",  12: "The Labyrinth",
  13: "The Warlock",  14: "The Fortress", 15: "The Dragon",
};

export function getZoneNames(difficulty: Difficulty): Record<number, string> {
  return difficulty === 'hard' ? ZONE_NAMES_HARD : ZONE_NAMES_NORMAL;
}

export const ABILITY_LABELS: Record<string, string> = {
  criticalHit: "Critical Hit",
  counterAttack: "Counter-Attack",
  magicSpell: "Magic Spell",
  constitution: "Constitution",
};

export const ABILITY_DESCRIPTIONS: Record<string, string> = {
  criticalHit: "Flip die to opposite face",
  counterAttack: "Add or subtract 1",
  magicSpell: "Reroll one die",
  constitution: "Reroll selected dice",
};
