# Lantern — Solitaire Roll & Write Adventure

Browser game adaptation of the physical roll & write game "Lantern" by D. Di Maggio.

## Tech Stack

React 18, TypeScript, Vite 8, Tailwind CSS 3, framer-motion 11, lucide-react, clsx, tailwind-merge.

## Architecture

Follows Blackjack project pattern: `types` → `constants` → `utils` → `hooks` (context) → `components` → `App`.

```
src/
├── types/game.ts
├── constants/game.ts
├── utils/diceUtils.ts
├── utils/gameUtils.ts
├── hooks/useLantern.ts
├── hooks/useGame.tsx
├── components/
│   ├── GameBoard.tsx
│   ├── CharacterSheet.tsx
│   ├── HUD.tsx
│   ├── Dice.tsx
│   ├── DiceTray.tsx
│   ├── SetupOverlay.tsx
│   ├── FightOverlay.tsx
│   ├── ZoneEntryOverlay.tsx
│   ├── ZoneExitOverlay.tsx
│   ├── BonfireOverlay.tsx
│   ├── ResultOverlay.tsx
│   └── AbilityButton.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Game State Machine

```
SETUP → ZONE_ENTRY → (combo match?) → ZONE_EXIT → next zone → ZONE_ENTRY
                         ↓ no
                      FIGHTING → (combo match?) → ZONE_EXIT
                         ↓ no circles left
                      GAME_OVER
```

Zone 5 (Bonfire) is a special transition: ZONE_ENTRY → BONFIRE → ZONE_EXIT.

## Game Rules (Summary)

### Setup
- Roll 6d6. If sum < 15, player may reroll all.
- Assign one die to each: Critical Hit, Counter-Attack, Magic Spell, Constitution, Experience, Bonfire Scroll.
- Die value = number of circles painted (max 7 per ability).

### Gameplay Loop
**Step 1 — Enter Zone**: Roll 6d6. Gain +1 Experience for each die showing 1. If dice match zone requirements → go to Step 3. Otherwise → Step 2.

**Step 2 — Fight**: Use abilities to manipulate dice. Erase one circle per use. Abilities:
- Critical Hit: flip a die to its opposite face (1↔6, 2↔5, 3↔4).
- Counter-Attack: add or subtract 1 from a die.
- Magic Spell: reroll one die.
- Constitution: reroll any number of dice.

Gain +1 Experience for each 1 rolled during this step. Repeat until combo is met or no circles remain.

**Step 3 — Exit Zone**: Mark zone as cleared. If an Experience line was completed during this zone, add +1 circle to any ability (max 7). Proceed to next zone.

**Zone 5 — Bonfire**: Gain +1 Constitution circle. Replace current Experience circles with the Bonfire Scroll value (from setup). Recalculate `experienceLinesCompleted` based on the new experience amount (allow re-earning line bonuses on subsequent zone clears if Experience was reduced). Skip dice roll for this zone.

### Win/Lose
- **Win**: Defeat Zone 8 (6 identical dice).
- **Lose**: Run out of ability circles in a fight before meeting requirements.

### Scoring
Count remaining circles across all abilities + constitution:
- 0: Promising Adventurer
- 1-5: Master at Arms
- 6-15: Heroic Swashbuckler
- 16+: Legendary Lantern Lord

## Zone Requirements

| Zone | Fixed Dice | Wildcards | Rule |
|------|-----------|-----------|------|
| 1 | 2, 3, 4 | 3 | Require 2, 3, and 4 |
| 2 | 2, 3, 4 | 3 | Require 2, 3, and 4 |
| 3 | 3, 4, 5 | 3 | Require 3, 4, and 5 |
| 4 | — | — | Full house: 3 of one value + 3 of another |
| 5 | — | — | Special (bonfire, no dice roll) |
| 6 | 2, 3, 4 | 3 | Require 2, 3, and 4 |
| 7 | 4, 5, 6 | 3 | Require 4, 5, and 6 |
| 8 | — | — | Sextet: all 6 dice identical |

Validation: `checkZoneMatch(dice: number[], zone: number): boolean`. For fixed-value zones, check that dice array contains all required values (order-independent). For zone 4, check for two distinct groups of 3 equal values. For zone 8, check all 6 are equal.

## Data Model

```typescript
type GamePhase = 'SETUP' | 'ZONE_ENTRY' | 'FIGHTING' | 'ZONE_EXIT' | 'BONFIRE' | 'GAME_OVER' | 'VICTORY';

type AbilityName = 'criticalHit' | 'counterAttack' | 'magicSpell';

interface Dice {
  id: string;
  value: number;    // 1-6
  selected: boolean;
}

interface AbilityCircle {
  available: number;  // remaining uses (count down from total)
  total: number;      // initial count from setup (max 7)
}

interface GameState {
  phase: GamePhase;
  currentZone: number;
  clearedZones: boolean[];
  dice: Dice[];
  abilities: Record<AbilityName | 'constitution', AbilityCircle>;
  experience: number;
  experienceLinesCompleted: number;  // 0-3, which lines have given bonuses
  scrollExperience: number;          // fixed value for zone 5 reset
  setupDiceValues: number[];         // 6 initial roll values
  assignedSetup: Record<string, number>;
  pendingSkillBonuses: number;       // how many +1 bonuses to distribute in ZONE_EXIT
  rerollAvailable: boolean;
  winner: boolean | null;
}
```

## Key UX Rules

### Dice Interaction (FightOverlay)
- Click dice to select (golden border). Click again to deselect.
- Selected dice show preview on ability buttons (e.g., "3 → 4").
- Dice that satisfy zone requirements glow green.
- Match progress indicator shows how close player is to meeting requirements.

### SetupOverlay
- Drag & drop OR click-to-assign hybrid.
- Click filled slot to return die to tray (undo).
- "Start Journey" button only enabled when all 6 slots filled.
- Sum < 15 shows reroll option.

### ZoneExitOverlay
- Shows how many skill bonuses are pending (`pendingSkillBonuses`).
- Player picks which ability gets each +1 circle bonus.
- Abilities at max 7 are disabled in the picker.
- One bonus at a time, sequential selection.

### Auto Experience Tracking
- Every die roll that lands on 1 automatically increments Experience.
- Player never needs to manually track this.

## Visual Design

**Palette (medieval dark fantasy):**
- Background: `#0d0a05` (dark parchment)
- Primary text: `#d4c5a9` (parchment)
- Accent: `#c97d3f` (bronze/lantern) + `#e8c34b` (gold/fire)
- Action: `#d94e3c` (ember red)
- Success: `#5b9a4e` (moss green)

**Fonts:**
- Display: Cinzel (medieval titles)
- Body: Crimson Text (readable serif)
- Mono: JetBrains Mono (dice, numbers)

**Layout (Approach 3 — Board + Overlays):**
- GameBoard (map): fixed background, scrollable on mobile, SVG zigzag path connecting 8 zones
- CharacterSheet: fixed footer, horizontal parchment strip with abilities + experience
- HUD: minimal fixed header with current zone + remaining circles total
- Overlays: bottom sheets covering ~60% of screen, backdrop blur, 150-200ms spring animations
- Zone 5: animated flame icon

**Map Icons per zone (lucide-react):**
1. Wolf — use `PawPrint` or `Skull` placeholder
2. Cultist — `User` or `Ghost` placeholder
3. Ruins — `Church` or `Building2` placeholder
4. Skeletons — `Skull`
5. Bonfire — `Flame`
6. Spider — `Bug`
7. Tower — `TowerControl`
8. Dragon — `Swords`

## Files to Create

1. `package.json` — deps copied from Blackjack, rename to "lantern"
2. `index.html` — open graph, title "Lantern"
3. `vite.config.ts`
4. `tailwind.config.js`
5. `postcss.config.js`
6. `tsconfig.json` + `tsconfig.node.json`
7. `.gitignore`
8. `src/index.css` — noise texture overlay, custom classes
9. `src/main.tsx` — GameProvider wrapping App
10. `src/types/game.ts`
11. `src/constants/game.ts` — zone requirements, limits
12. `src/utils/diceUtils.ts` — roll, opposite face, shuffle
13. `src/utils/gameUtils.ts` — checkZoneMatch, experience line logic
14. `src/hooks/useLantern.ts` — full game logic
15. `src/hooks/useGame.tsx` — context provider
16. `src/components/*` — all UI components
17. `src/App.tsx` — main layout
