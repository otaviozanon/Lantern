import { ZONE_REQUIREMENTS, EXPERIENCE_LINES } from '../constants/game';
import { ZoneRequirement } from '../types/game';

function hasAllValues(diceValues: number[], required: number[]): boolean {
  const available = [...diceValues];
  for (const r of required) {
    const idx = available.indexOf(r);
    if (idx === -1) return false;
    available.splice(idx, 1);
  }
  return true;
}

function isFullHouse(diceValues: number[]): boolean {
  const freq = new Map<number, number>();
  for (const v of diceValues) freq.set(v, (freq.get(v) || 0) + 1);
  const counts = Array.from(freq.values()).sort((a, b) => b - a);
  return counts.length === 2 && counts[0] === 3 && counts[1] === 3;
}

function isSextet(diceValues: number[]): boolean {
  return new Set(diceValues).size === 1;
}

export function checkZoneMatch(diceValues: number[], zone: number): boolean {
  const req: ZoneRequirement | undefined = ZONE_REQUIREMENTS[zone];
  if (!req) return false;

  switch (req.rule) {
    case 'fixed':
      return hasAllValues(diceValues, req.fixed);
    case 'fullHouse':
      return isFullHouse(diceValues);
    case 'sextet':
      return isSextet(diceValues);
    case 'bonfire':
      return true;
    default:
      return false;
  }
}

export function getMatchProgress(diceValues: number[], zone: number): { required: number; matched: number } {
  const req = ZONE_REQUIREMENTS[zone];
  if (!req || req.rule === 'bonfire') return { required: 0, matched: 0 };

  if (req.rule === 'fixed') {
    const available = [...diceValues];
    let matched = 0;
    for (const r of req.fixed) {
      const idx = available.indexOf(r);
      if (idx !== -1) {
        matched++;
        available.splice(idx, 1);
      }
    }
    return { required: req.fixed.length, matched };
  }

  if (req.rule === 'fullHouse') {
    return { required: 6, matched: isFullHouse(diceValues) ? 6 : 0 };
  }

  if (req.rule === 'sextet') {
    return { required: 6, matched: isSextet(diceValues) ? 6 : 0 };
  }

  return { required: 0, matched: 0 };
}

export function getExperienceLinesCompleted(experience: number): number {
  let remaining = experience;
  let completed = 0;
  for (const line of EXPERIENCE_LINES) {
    if (remaining >= line) {
      completed++;
      remaining -= line;
    } else {
      break;
    }
  }
  return completed;
}

export function getScore(state: { abilities: Record<string, { available: number }> }): number {
  return Object.values(state.abilities).reduce((sum, a) => sum + a.available, 0);
}

export function getTitle(score: number): string {
  if (score >= 16) return 'Legendary Lantern Lord';
  if (score >= 6) return 'Heroic Swashbuckler';
  if (score >= 1) return 'Master at Arms';
  return 'Promising Adventurer';
}
