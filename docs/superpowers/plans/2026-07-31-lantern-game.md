# Lantern Game Implementation Plan

> **For agentic workers:** Use task-level granularity. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based solitaire roll & write adventure game (Lantern) with React + Vite, matching the Blackjack project's architecture.

**Architecture:** Types → Constants → Utils → Hooks (context) → Components → App. Game board map + character sheet always visible, actions handled via bottom-sheet overlays with framer-motion animations.

**Tech Stack:** React 18, TypeScript, Vite 8, Tailwind CSS 3, framer-motion 11, lucide-react, clsx, tailwind-merge.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `.gitignore`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "lantern",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^11.2.10",
    "lucide-react": "^0.395.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.2.2",
    "vite": "^8.0.10"
  }
}
```

- [ ] **Step 2: Write index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lantern — Solitaire Roll & Write</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-lantern-dark text-lantern-parchment selection:bg-lantern-bronze selection:text-black overflow-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Write vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 4: Write tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lantern-dark': '#0d0a05',
        'lantern-parchment': '#d4c5a9',
        'lantern-bronze': '#c97d3f',
        'lantern-gold': '#e8c34b',
        'lantern-ember': '#d94e3c',
        'lantern-moss': '#5b9a4e',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Crimson Text', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Write postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 7: Write tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 8: Write .gitignore**

```
node_modules
dist
.vite
*.local
```

- [ ] **Step 9: Install dependencies**

Run: `npm install`
Expected: dependencies install without errors.

---

### Task 2: Types

**Files:**
- Create: `src/types/game.ts`

- [ ] **Step 1: Write src/types/game.ts**

```typescript
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
```

---

### Task 3: Constants

**Files:**
- Create: `src/constants/game.ts`

- [ ] **Step 1: Write src/constants/game.ts**

```typescript
import { ZoneRequirement } from '../types/game';

export const MAX_CIRCLES = 7;
export const EXPERIENCE_LINES = [5, 4, 3]; // circles per line
export const TOTAL_EXPERIENCE_CIRCLES = 12; // 5 + 4 + 3
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
```

---

### Task 4: Dice Utilities

**Files:**
- Create: `src/utils/diceUtils.ts`

- [ ] **Step 1: Write src/utils/diceUtils.ts**

```typescript
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

export function getDiceValues(dice: Dice[]): number[] {
  return dice.map(d => d.value);
}

export function diceSum(dice: Dice[]): number {
  return dice.reduce((sum, d) => sum + d.value, 0);
}
```

---

### Task 5: Game Utilities

**Files:**
- Create: `src/utils/gameUtils.ts`

- [ ] **Step 1: Write src/utils/gameUtils.ts**

```typescript
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
```

---

### Task 6: Game Logic Hook

**Files:**
- Create: `src/hooks/useLantern.ts`

- [ ] **Step 1: Write src/hooks/useLantern.ts**

```typescript
import { useState, useCallback } from 'react';
import { GameState, GamePhase, Dice, StatKey, AbilityName } from '../types/game';
import { MAX_CIRCLES, SETUP_REROLL_THRESHOLD, EXPERIENCE_LINES } from '../constants/game';
import { rollDice, oppositeFace, adjustValue, diceSum } from '../utils/diceUtils';
import { checkZoneMatch, getExperienceLinesCompleted, getScore, getTitle } from '../utils/gameUtils';

const ABILITY_NAMES: AbilityName[] = ['criticalHit', 'counterAttack', 'magicSpell'];

function createInitialState(): GameState {
  return {
    phase: 'SETUP',
    currentZone: 1,
    clearedZones: Array(9).fill(false),
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

  const gainExperience = useCallback((amount: number) => {
    setState(prev => {
      const newExp = Math.min(prev.experience + amount, 12); // max 12 circles
      return { ...prev, experience: newExp };
    });
  }, []);

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

  const assignSetupDie = useCallback((slot: string, value: number) => {
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
      if (match) {
        newPhase = 'ZONE_EXIT';
      } else if (!hasCircles) {
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
      if (comboMet) newPhase = 'ZONE_EXIT';
      else if (!hasCircles) newPhase = 'GAME_OVER';

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
      if (comboMet) newPhase = 'ZONE_EXIT';
      else if (!hasCircles) newPhase = 'GAME_OVER';

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
      if (comboMet) newPhase = 'ZONE_EXIT';
      else if (!hasCircles) newPhase = 'GAME_OVER';

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
      if (comboMet) newPhase = 'ZONE_EXIT';
      else if (!hasCircles) newPhase = 'GAME_OVER';

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
    setState(prev => ({
      ...prev,
      phase: 'ZONE_EXIT',
    }));
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

        if (prev.currentZone === 8) {
          const score = getScore({ abilities: newAbilities });
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
          const nextZone = Math.min(prev.currentZone + 1, 8);
          const isBonfire = nextZone === 5;
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
        if (prev.currentZone === 8) {
          const score = getScore({ abilities: prev.abilities });
          return {
            ...prev,
            clearedZones: newCleared,
            phase: 'VICTORY',
            winner: true,
          };
        }
        const nextZone = Math.min(prev.currentZone + 1, 8);
        const isBonfire = nextZone === 5;
        return {
          ...prev,
          clearedZones: newCleared,
          currentZone: nextZone,
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
      const previousLinesCompleted = prev.experienceLinesCompleted;
      const newLinesCompleted = getExperienceLinesCompleted(newExperience);
      const linesLost = Math.max(0, previousLinesCompleted - newLinesCompleted);

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
```

---

### Task 7: Context Provider

**Files:**
- Create: `src/hooks/useGame.tsx`

- [ ] **Step 1: Write src/hooks/useGame.tsx**

```typescript
import React, { createContext, useContext, ReactNode } from 'react';
import { useLantern } from './useLantern';

type GameContextType = ReturnType<typeof useLantern>;

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const game = useLantern();
  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
```

---

### Task 8: Global CSS

**Files:**
- Create: `src/index.css`

- [ ] **Step 1: Write src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply h-screen w-screen overflow-hidden antialiased select-none;
    background: #0d0a05;
    color: #d4c5a9;
  }

  body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.03;
    pointer-events: none;
    z-index: 10;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }
}

@layer components {
  .parchment-bg {
    background: linear-gradient(180deg, #1a140c 0%, #0d0a05 100%);
  }

  .gold-shimmer {
    background: linear-gradient(135deg, #e8c34b 0%, #fdf0a6 50%, #e8c34b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    @apply animate-pulse;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

---

### Task 9: Entry Point

**Files:**
- Create: `src/main.tsx`

- [ ] **Step 1: Write src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GameProvider } from './hooks/useGame'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
)
```

---

### Task 10: Dice Component

**Files:**
- Create: `src/components/Dice.tsx`

- [ ] **Step 1: Write src/components/Dice.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Dice as DiceType } from '../types/game';

const DICE_DOTS: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

export const DiceComponent: React.FC<{
  dice: DiceType;
  onClick?: () => void;
  className?: string;
  small?: boolean;
}> = ({ dice, onClick, className, small }) => {
  const size = small ? 'w-10 h-10' : 'w-14 h-14 md:w-16 md:h-16';
  const dotSize = small ? 'w-2 h-2' : 'w-2.5 h-2.5 md:w-3 md:h-3';

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={clsx(
        size,
        'rounded-lg cursor-pointer transition-all select-none relative',
        dice.selected
          ? 'bg-lantern-gold text-lantern-dark ring-2 ring-lantern-gold ring-offset-2 ring-offset-lantern-dark'
          : 'bg-[#f5eedc] text-lantern-dark hover:bg-[#fff8e7]',
        className
      )}
    >
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1">
        {DICE_DOTS[dice.value]?.map(([row, col], i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
            className={clsx(dotSize, 'rounded-full bg-current')}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
          />
        )) || null}
      </div>
    </motion.div>
  );
};
```

---

### Task 11: DiceTray Component

**Files:**
- Create: `src/components/DiceTray.tsx`

- [ ] **Step 1: Write src/components/DiceTray.tsx**

```typescript
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice } from '../types/game';
import { DiceComponent } from './Dice';

interface DiceTrayProps {
  dice: Dice[];
  onDiceClick: (id: string) => void;
  matchedIndices?: Set<number>;
}

export const DiceTray: React.FC<DiceTrayProps> = ({ dice, onDiceClick, matchedIndices }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 p-4">
      <AnimatePresence mode="popLayout">
        {dice.map((d, idx) => (
          <motion.div
            key={d.id}
            layout
            initial={{ opacity: 0, y: -20, rotate: Math.random() * 20 - 10 }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: 0,
              boxShadow: matchedIndices?.has(idx)
                ? '0 0 12px rgba(91, 154, 78, 0.6)'
                : 'none',
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: idx * 0.05 }}
          >
            <DiceComponent
              dice={d}
              onClick={() => onDiceClick(d.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
```

---

### Task 12: AbilityButton Component

**Files:**
- Create: `src/components/AbilityButton.tsx`

- [ ] **Step 1: Write src/components/AbilityButton.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Swords, Sword, Wand2, Shield } from 'lucide-react';
import { AbilityName } from '../types/game';

const ICON_MAP: Record<string, React.ElementType> = {
  criticalHit: Sword,
  counterAttack: Swords,
  magicSpell: Wand2,
  constitution: Shield,
};

interface AbilityButtonProps {
  name: AbilityName | 'constitution';
  label: string;
  description: string;
  available: number;
  total: number;
  preview?: string;
  disabled?: boolean;
  onClick: () => void;
}

export const AbilityButton: React.FC<AbilityButtonProps> = ({
  name,
  label,
  description,
  available,
  total,
  preview,
  disabled,
  onClick,
}) => {
  const Icon = ICON_MAP[name] || Sword;
  const isDepleted = available <= 0;
  const isDisabled = disabled || isDepleted;

  return (
    <motion.button
      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all min-w-[80px]',
        isDisabled
          ? 'opacity-20 cursor-not-allowed border-white/5 bg-white/5'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-lantern-bronze/50'
      )}
    >
      <Icon className="w-5 h-5 text-lantern-gold" />
      <span className="text-xs font-display font-bold text-lantern-parchment tracking-wider">
        {label}
      </span>
      {preview && !isDisabled && (
        <span className="text-[10px] font-mono text-lantern-bronze">{preview}</span>
      )}
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor: i < available ? '#c97d3f' : '#2a2015',
              scale: i < available ? 1 : 0.9,
            }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>
      <span className="text-[9px] text-lantern-parchment/40 font-mono">
        {available}/{total}
      </span>
    </motion.button>
  );
};
```

---

### Task 13: HUD Component

**Files:**
- Create: `src/components/HUD.tsx`

- [ ] **Step 1: Write src/components/HUD.tsx**

```typescript
import React from 'react';
import { useGame } from '../hooks/useGame';
import { ZONE_NAMES } from '../constants/game';
import { Flame } from 'lucide-react';

export const HUD: React.FC = () => {
  const { state } = useGame();
  const { phase, currentZone, abilities } = state;
  const totalCircles = Object.values(abilities).reduce((sum, a) => sum + a.available, 0);

  if (phase === 'SETUP' || phase === 'GAME_OVER' || phase === 'VICTORY') return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
      <div className="flex flex-col">
        <span className="text-[10px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
          Zone
        </span>
        <span className="text-xl font-display font-bold text-lantern-gold">
          {currentZone} — {ZONE_NAMES[currentZone] || 'Unknown'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
            Circles
          </span>
          <span className="text-xl font-mono font-bold text-lantern-parchment">
            {totalCircles}
          </span>
        </div>
        {currentZone === 5 && phase !== 'BONFIRE' && (
          <Flame className="w-5 h-5 text-lantern-ember animate-pulse" />
        )}
      </div>
    </header>
  );
};
```

---

### Task 14: GameBoard Component (Map)

**Files:**
- Create: `src/components/GameBoard.tsx`

- [ ] **Step 1: Write src/components/GameBoard.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { PawPrint, Ghost, Building2, Skull, Flame, Bug, TowerControl, Swords } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { ZONE_NAMES } from '../constants/game';

const ZONE_ICONS: Record<number, React.ElementType> = {
  1: PawPrint,
  2: Ghost,
  3: Building2,
  4: Skull,
  5: Flame,
  6: Bug,
  7: TowerControl,
  8: Swords,
};

const ZONE_POSITIONS: Record<number, { x: string; y: string }> = {
  1: { x: '15%', y: '88%' },
  2: { x: '35%', y: '75%' },
  3: { x: '55%', y: '65%' },
  4: { x: '72%', y: '52%' },
  5: { x: '55%', y: '40%' },
  6: { x: '35%', y: '28%' },
  7: { x: '50%', y: '15%' },
  8: { x: '50%', y: '5%' },
};

export const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { phase, currentZone, clearedZones } = state;
  if (phase === 'SETUP' || phase === 'GAME_OVER' || phase === 'VICTORY') return null;

  return (
    <div className="fixed inset-0 pt-16 pb-28 pointer-events-none">
      <div className="relative w-full h-full max-w-lg mx-auto">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <path
            d="M15% 88% Q25% 81% 35% 75% Q45% 69% 55% 65% Q63% 58% 72% 52% Q63% 46% 55% 40% Q45% 34% 35% 28% Q42% 21% 50% 15% L50% 5%"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 4"
            className="text-lantern-parchment/10"
            fill="none"
          />
        </svg>

        {Array.from({ length: 8 }, (_, i) => i + 1).map(zone => {
          const Icon = ZONE_ICONS[zone] || Skull;
          const pos = ZONE_POSITIONS[zone];
          const isCleared = clearedZones[zone];
          const isActive = currentZone === zone;

          return (
            <motion.div
              key={zone}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
              animate={{
                scale: isActive ? 1.15 : 0.85,
                opacity: isCleared ? 0.4 : 1,
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center border transition-colors',
                  isActive
                    ? 'bg-lantern-bronze/20 border-lantern-gold shadow-lg shadow-lantern-gold/20'
                    : isCleared
                    ? 'bg-lantern-moss/20 border-lantern-moss/50'
                    : 'bg-lantern-dark/50 border-lantern-parchment/10'
                )}
              >
                <Icon className={clsx(
                  'w-5 h-5',
                  isActive ? 'text-lantern-gold' : isCleared ? 'text-lantern-moss' : 'text-lantern-parchment/30'
                )} />
              </div>
              <span className={clsx(
                'text-[9px] font-display font-bold tracking-wider uppercase',
                isActive ? 'text-lantern-gold' : 'text-lantern-parchment/40'
              )}>
                {zone}
              </span>
              <span className={clsx(
                'text-[8px] font-body leading-none text-center max-w-[60px]',
                isActive ? 'text-lantern-parchment/70' : 'text-lantern-parchment/20'
              )}>
                {ZONE_NAMES[zone]}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
```

---

### Task 15: CharacterSheet Component

**Files:**
- Create: `src/components/CharacterSheet.tsx`

- [ ] **Step 1: Write src/components/CharacterSheet.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Swords, Wand2, Shield, BookOpen } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { ABILITY_LABELS } from '../constants/game';
import { EXPERIENCE_LINES } from '../constants/game';

const ABILITY_ICONS: Record<string, React.ElementType> = {
  criticalHit: Sword,
  counterAttack: Swords,
  magicSpell: Wand2,
  constitution: Shield,
};

export const CharacterSheet: React.FC = () => {
  const { state } = useGame();
  const { phase, abilities, experience, experienceLinesCompleted } = state;
  if (phase === 'SETUP' || phase === 'GAME_OVER' || phase === 'VICTORY') return null;

  const experienceLines = (() => {
    let remaining = experience;
    const lines: number[] = [];
    for (const lineSize of EXPERIENCE_LINES) {
      const filled = Math.min(remaining, lineSize);
      lines.push(filled);
      remaining -= filled;
    }
    while (lines.length < 3) lines.push(0);
    return lines;
  })();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 p-3">
      <div className="parchment-bg border border-lantern-bronze/20 rounded-2xl px-4 py-3 max-w-3xl mx-auto shadow-2xl">
        <div className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide min-w-0">
          {(['criticalHit', 'counterAttack', 'magicSpell', 'constitution'] as const).map(key => {
            const a = abilities[key];
            const Icon = ABILITY_ICONS[key] || Sword;
            return (
              <div key={key} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <Icon className="w-4 h-4 text-lantern-bronze" />
                <span className="text-[9px] font-display font-bold text-lantern-parchment/60 tracking-wider text-center leading-tight">
                  {ABILITY_LABELS[key]}
                </span>
                <div className="flex flex-wrap justify-center gap-0.5 max-w-[80px]">
                  {Array.from({ length: a.total }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        backgroundColor: i < a.available ? '#c97d3f' : '#2a2015',
                        scale: i < a.available ? 1 : 0.8,
                      }}
                      className="w-2 h-2 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-lantern-parchment/30">
                  {a.available}/{a.total}
                </span>
              </div>
            );
          })}

          {/* Experience section */}
          <div className="w-24 flex-none flex flex-col items-center gap-1 border-l border-lantern-bronze/10 pl-3">
            <BookOpen className="w-4 h-4 text-lantern-gold" />
            <span className="text-[9px] font-display font-bold text-lantern-parchment/60 tracking-wider">
              XP
            </span>
            <div className="flex flex-col gap-0.5">
              {experienceLines.map((filled, lineIdx) => (
                <div key={lineIdx} className="flex gap-0.5">
                  {Array.from({ length: EXPERIENCE_LINES[lineIdx] }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        backgroundColor: i < filled ? '#e8c34b' : '#2a2015',
                        boxShadow: lineIdx < experienceLinesCompleted && i === EXPERIENCE_LINES[lineIdx] - 1 && filled === EXPERIENCE_LINES[lineIdx]
                          ? '0 0 4px rgba(232, 195, 75, 0.5)'
                          : 'none',
                      }}
                      className="w-1.5 h-1.5 rounded-full"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

---

### Task 16: SetupOverlay Component

**Files:**
- Create: `src/components/SetupOverlay.tsx`

- [ ] **Step 1: Write src/components/SetupOverlay.tsx**

```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useGame } from '../hooks/useGame';
import { DiceComponent } from './Dice';
import { diceSum } from '../utils/diceUtils';
import { SETUP_REROLL_THRESHOLD } from '../constants/game';

const SETUP_SLOTS: { key: string; label: string }[] = [
  { key: 'criticalHit', label: 'Critical Hit' },
  { key: 'counterAttack', label: 'Counter-Attack' },
  { key: 'magicSpell', label: 'Magic Spell' },
  { key: 'constitution', label: 'Constitution' },
  { key: 'experience', label: 'Experience' },
  { key: 'scroll', label: 'Bonfire Scroll' },
];

export const SetupOverlay: React.FC = () => {
  const { state, rollSetup, assignSetupDie, confirmSetup } = useGame();
  const [selectedDieValue, setSelectedDieValue] = useState<number | null>(null);
  const [selectedDieIndex, setSelectedDieIndex] = useState<number | null>(null);
  const [assignedIndices, setAssignedIndices] = useState<Set<number>>(new Set());

  if (state.phase !== 'SETUP') return null;

  const sum = diceSum(state.dice);
  const allAssigned = Object.values(state.assignedSetup).every(v => v > 0);
  const availableIndices = state.dice
    .map((_, i) => (assignedIndices.has(i) ? -1 : i))
    .filter(i => i >= 0);

  const handleDieClick = (index: number) => {
    if (availableIndices.includes(index)) {
      setSelectedDieValue(state.dice[index].value);
      setSelectedDieIndex(index);
    }
  };

  const handleSlotClick = (key: string) => {
    if (selectedDieValue !== null && selectedDieIndex !== null && state.assignedSetup[key] === 0) {
      assignSetupDie(key, selectedDieValue);
      setAssignedIndices(prev => new Set(prev).add(selectedDieIndex));
      setSelectedDieValue(null);
      setSelectedDieIndex(null);
    }
  };

  const handleUndo = (key: string) => {
    if (state.assignedSetup[key] > 0) {
      const value = state.assignedSetup[key];
      const idx = state.dice.findIndex(
        (_, i) => assignedIndices.has(i) && state.dice[i].value === value
      );
      if (idx !== -1) {
        setAssignedIndices(prev => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
      }
      assignSetupDie(key, 0);
      setSelectedDieValue(null);
      setSelectedDieIndex(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-lantern-dark/95 flex flex-col items-center justify-center gap-6 p-6"
    >
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-display font-black text-lantern-gold gold-shimmer tracking-[0.2em] uppercase">
          Lantern
        </h1>
        <p className="text-sm text-lantern-parchment/50 font-body italic">
          Assign your destiny
        </p>
      </div>

      <div className="flex gap-3">
        {state.dice.map((d, i) => {
          const assigned = assignedIndices.has(i);
          return (
            <div key={i} className="relative">
              <DiceComponent
                dice={d}
                onClick={() => handleDieClick(i)}
                className={clsx(
                  assigned && 'opacity-30 pointer-events-none',
                  selectedDieIndex === i && 'ring-2 ring-lantern-gold'
                )}
              />
            </div>
          );
        })}
      </div>

      {sum < SETUP_REROLL_THRESHOLD && state.dice.length === 6 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={rollSetup}
          className="px-4 py-2 text-xs font-display font-bold text-lantern-ember border border-lantern-ember/30 rounded-full hover:bg-lantern-ember/10 transition-all uppercase tracking-[0.2em]"
        >
          Sum {sum} &lt; {SETUP_REROLL_THRESHOLD} — Reroll
        </motion.button>
      )}

      <div className="grid grid-cols-3 gap-3 max-w-xs w-full">
        {SETUP_SLOTS.map(slot => (
          <motion.button
            key={slot.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => state.assignedSetup[slot.key] > 0 ? handleUndo(slot.key) : handleSlotClick(slot.key)}
            className={clsx(
              'p-3 rounded-xl border text-center transition-all min-h-[70px] flex flex-col items-center justify-center gap-1',
              state.assignedSetup[slot.key] > 0
                ? 'bg-lantern-bronze/20 border-lantern-gold/50'
                : selectedDieValue !== null
                ? 'border-dashed border-lantern-parchment/20 hover:border-lantern-bronze/50 cursor-pointer'
                : 'border-dashed border-lantern-parchment/10 opacity-50'
            )}
          >
            <span className="text-[10px] font-display font-bold text-lantern-parchment/70 tracking-wider leading-tight">
              {slot.label}
            </span>
            {state.assignedSetup[slot.key] > 0 ? (
              <span className="text-lg font-mono font-bold text-lantern-gold">
                {state.assignedSetup[slot.key]}
              </span>
            ) : (
              <span className="text-lg text-lantern-parchment/20">—</span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {allAssigned && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={confirmSetup}
            className="bg-lantern-gold text-lantern-dark px-12 py-3 font-display font-black rounded-full hover:bg-white active:scale-95 transition-all shadow-2xl text-sm uppercase tracking-[0.3em]"
          >
            Begin Journey
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
```

---

### Task 17: ZoneEntryOverlay + FightOverlay

**Files:**
- Create: `src/components/ZoneEntryOverlay.tsx`
- Create: `src/components/FightOverlay.tsx`

- [ ] **Step 1: Write src/components/ZoneEntryOverlay.tsx**

```typescript
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { ZONE_NAMES } from '../constants/game';
import { DiceTray } from './DiceTray';

export const ZoneEntryOverlay: React.FC = () => {
  const { state, enterZone } = useGame();
  if (state.phase !== 'ZONE_ENTRY') return null;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-[80] bg-lantern-dark/95 border-t border-lantern-bronze/20 rounded-t-3xl px-6 py-6 max-h-[65vh] overflow-y-auto scrollbar-hide"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-1 bg-lantern-parchment/20 rounded-full" />

        <h2 className="text-lg font-display font-bold text-lantern-gold tracking-wider uppercase">
          Zone {state.currentZone}: {ZONE_NAMES[state.currentZone]}
        </h2>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={enterZone}
          className="bg-lantern-bronze text-lantern-dark px-10 py-3 font-display font-black rounded-full hover:bg-lantern-gold transition-all shadow-xl text-sm uppercase tracking-[0.2em]"
        >
          Roll 6d6
        </motion.button>
      </div>
    </motion.div>
  );
};
```

- [ ] **Step 2: Write src/components/FightOverlay.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { ZONE_NAMES, ZONE_REQUIREMENTS, ABILITY_DESCRIPTIONS } from '../constants/game';
import { DiceTray } from './DiceTray';
import { AbilityButton } from './AbilityButton';
import { checkZoneMatch, getMatchProgress } from '../utils/gameUtils';
import { oppositeFace } from '../utils/diceUtils';

export const FightOverlay: React.FC = () => {
  const { state, toggleDiceSelection, useCriticalHit, useCounterAttack, useMagicSpell, useConstitution, confirmCombo } = useGame();
  if (state.phase !== 'FIGHTING') return null;

  const values = state.dice.map(d => d.value);
  const match = checkZoneMatch(values, state.currentZone);
  const progress = getMatchProgress(values, state.currentZone);
  const selectedDie = state.dice.find(d => d.selected);

  const critPreview = selectedDie ? `${selectedDie.value} → ${oppositeFace(selectedDie.value)}` : undefined;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-[80] bg-lantern-dark/95 border-t border-lantern-bronze/20 rounded-t-3xl px-4 py-4 max-h-[70vh] overflow-y-auto scrollbar-hide"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-1 bg-lantern-parchment/20 rounded-full" />

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-[10px] font-mono text-lantern-parchment/40 mb-1">
            <span>Match Progress</span>
            <span>{progress.matched}/{progress.required}</span>
          </div>
          <div className="h-1.5 bg-lantern-dark rounded-full overflow-hidden border border-lantern-parchment/10">
            <motion.div
              className="h-full bg-lantern-moss rounded-full"
              animate={{
                width: progress.required > 0 ? `${(progress.matched / progress.required) * 100}%` : '0%',
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </div>
        </div>

        <DiceTray
          dice={state.dice}
          onDiceClick={toggleDiceSelection}
        />

        {/* Abilities row */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 w-full justify-center">
          {(['criticalHit', 'counterAttack', 'magicSpell', 'constitution'] as const).map(key => (
            <React.Fragment key={key}>
              {key === 'counterAttack' ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-display font-bold text-lantern-parchment/70 tracking-wider">
                    Counter
                  </span>
                  <div className="flex gap-1">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled={state.abilities.counterAttack.available <= 0}
                      onClick={() => useCounterAttack(-1)}
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      -1
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled={state.abilities.counterAttack.available <= 0}
                      onClick={() => useCounterAttack(1)}
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      +1
                    </motion.button>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: state.abilities.counterAttack.total }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ backgroundColor: i < state.abilities.counterAttack.available ? '#c97d3f' : '#2a2015' }}
                        className="w-1.5 h-1.5 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-[8px] text-lantern-parchment/30 font-mono">
                    {state.abilities.counterAttack.available}/{state.abilities.counterAttack.total}
                  </span>
                </div>
              ) : (
                <AbilityButton
                  key={key}
                  name={key}
                  label={key === 'criticalHit' ? 'Crit' : key === 'magicSpell' ? 'Spell' : 'Endure'}
                  description={ABILITY_DESCRIPTIONS[key]}
                  available={state.abilities[key].available}
                  total={state.abilities[key].total}
                  preview={key === 'criticalHit' ? critPreview : undefined}
                  onClick={() => {
                    if (key === 'criticalHit') useCriticalHit();
                    if (key === 'magicSpell') useMagicSpell();
                    if (key === 'constitution') useConstitution();
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {match && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={confirmCombo}
            className="bg-lantern-moss text-lantern-dark px-10 py-2.5 font-display font-black rounded-full hover:bg-green-400 transition-all shadow-lg text-sm uppercase tracking-[0.2em]"
          >
            Zone Cleared!
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
```

---

### Task 18: ZoneExitOverlay + BonfireOverlay

**Files:**
- Create: `src/components/ZoneExitOverlay.tsx`
- Create: `src/components/BonfireOverlay.tsx`

- [ ] **Step 1: Write src/components/ZoneExitOverlay.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { ZONE_NAMES } from '../constants/game';
import { StatKey } from '../types/game';
import { MAX_CIRCLES } from '../constants/game';

export const ZoneExitOverlay: React.FC = () => {
  const { state, exitZone } = useGame();
  if (state.phase !== 'ZONE_EXIT') return null;

  const handleBonus = (key: StatKey) => {
    exitZone(key);
  };

  const handleContinue = () => {
    exitZone(null);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-[80] bg-lantern-dark/95 border-t border-lantern-moss/30 rounded-t-3xl px-6 py-6"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-1 bg-lantern-parchment/20 rounded-full" />
        <h2 className="text-lg font-display font-bold text-lantern-moss tracking-wider uppercase">
          Zone {state.currentZone} Cleared!
        </h2>

        {state.pendingSkillBonuses > 0 && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-lantern-parchment/70 font-body">
              Choose where to add +1 circle ({state.pendingSkillBonuses} remaining)
            </p>
            <div className="flex gap-2">
              {(['criticalHit', 'counterAttack', 'magicSpell', 'constitution'] as StatKey[]).map(key => {
                const a = state.abilities[key];
                const atMax = a.total >= MAX_CIRCLES;
                return (
                  <motion.button
                    key={key}
                    whileTap={!atMax ? { scale: 0.95 } : undefined}
                    onClick={() => !atMax && handleBonus(key)}
                    disabled={atMax}
                    className={`px-4 py-2 rounded-lg border font-display text-xs font-bold uppercase tracking-wider transition-all ${
                      atMax
                        ? 'opacity-20 cursor-not-allowed border-white/5'
                        : 'border-lantern-gold/30 hover:bg-lantern-gold/10 text-lantern-gold'
                    }`}
                  >
                    {key === 'criticalHit' ? 'Crit' : key === 'counterAttack' ? 'Counter' : key === 'magicSpell' ? 'Spell' : 'Endure'}
                    {' '}({a.total}/{MAX_CIRCLES})
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {state.pendingSkillBonuses === 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="bg-lantern-gold text-lantern-dark px-10 py-2.5 font-display font-black rounded-full hover:bg-white transition-all shadow-lg text-sm uppercase tracking-[0.2em]"
          >
            {state.currentZone === 8 ? 'See Results' : 'Next Zone'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
```

- [ ] **Step 2: Write src/components/BonfireOverlay.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useGame } from '../hooks/useGame';

export const BonfireOverlay: React.FC = () => {
  const { state, handleBonfire } = useGame();
  if (state.phase !== 'BONFIRE') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-lantern-dark/98 flex flex-col items-center justify-center gap-6 p-6"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Flame className="w-16 h-16 text-lantern-ember" />
      </motion.div>

      <h2 className="text-2xl font-display font-black text-lantern-gold tracking-[0.2em] uppercase">
        The Bonfire
      </h2>

      <p className="text-sm text-lantern-parchment/60 font-body text-center max-w-xs">
        Rest and reflect. Gain +1 Constitution and reset your Experience.
      </p>

      <div className="flex flex-col items-center gap-2 text-sm font-mono">
        <span className="text-lantern-parchment/40">Scroll Experience:</span>
        <span className="text-2xl text-lantern-gold font-bold">{state.scrollExperience}</span>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleBonfire}
        className="bg-lantern-ember text-white px-10 py-3 font-display font-black rounded-full hover:bg-red-500 transition-all shadow-xl text-sm uppercase tracking-[0.2em]"
      >
        Rest & Continue
      </motion.button>
    </motion.div>
  );
};
```

---

### Task 19: ResultOverlay Component

**Files:**
- Create: `src/components/ResultOverlay.tsx`

- [ ] **Step 1: Write src/components/ResultOverlay.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { getScore, getTitle } from '../utils/gameUtils';

export const ResultOverlay: React.FC = () => {
  const { state, restart } = useGame();
  if (state.phase !== 'GAME_OVER' && state.phase !== 'VICTORY') return null;

  const score = getScore(state);
  const title = getTitle(score);
  const isVictory = state.phase === 'VICTORY';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-lantern-dark/98 flex flex-col items-center justify-center z-[200] gap-6 p-6"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-[10px] text-lantern-parchment/20 uppercase font-black tracking-[0.4em]">
          {isVictory ? 'Victory' : 'Game Over'}
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-black gold-shimmer uppercase text-center px-4">
          {isVictory ? 'The Dragon is Defeated!' : 'Darkness Consumes the Fortress'}
        </h2>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-lantern-parchment/30 uppercase font-black tracking-[0.3em]">
          Adventure Score
        </span>
        <span className="text-4xl font-mono font-bold text-lantern-gold">{score}</span>
        <span className="text-sm font-body text-lantern-parchment/60 italic">{title}</span>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.95 }}
        onClick={restart}
        className="bg-lantern-gold text-lantern-dark px-12 py-4 font-display font-black rounded-full hover:bg-white active:scale-95 transition-all shadow-2xl text-sm uppercase tracking-[0.3em] cursor-pointer"
      >
        New Adventure
      </motion.button>
    </motion.div>
  );
};
```

---

### Task 20: App.tsx Integration

**Files:**
- Create: `src/App.tsx`

- [ ] **Step 1: Write src/App.tsx**

```typescript
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: TypeScript compilation succeeds, Vite builds without errors.

---

### Task 21: Test Game Flow

- [ ] **Step 1: Start dev server and manually test**

Run: `npm run dev`
Expected: Dev server starts on localhost.

Manual test checklist:
1. Setup screen shows 6 dice, can assign all slots, "Begin Journey" appears
2. Zone 1 entry screen shows, click "Roll 6d6"
3. Fight overlay shows dice with selection, abilities work (use circles)
4. Match progress indicator updates as dice change
5. "Zone Cleared!" button appears when combo met
6. Zone exit shows bonus picker (if experience line completed)
7. Zone 5 triggers Bonfire overlay
8. Zone 8 victory shows score and title
9. Game over shows when all circles depleted
10. "New Adventure" restarts from setup
