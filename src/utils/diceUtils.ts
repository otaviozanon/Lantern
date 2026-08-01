import { Dice } from '../types/game';

export function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function rollDice(count: number): Dice[] {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    value: rollDie(),
    selected: false,
  }));
}

export function oppositeFace(value: number): number {
  return 7 - value;
}

export function adjustValue(value: number, delta: number): number {
  let result = value + delta;
  if (result > 6) result = 6;
  if (result < 1) result = 1;
  return result;
}

export function diceSum(dice: Dice[]): number {
  return dice.reduce((sum, d) => sum + d.value, 0);
}
