# Frontend Quest — Project Progress

## Current focus

**Sprint 5 — Story & Gameplay Core (P0 vertical slice)**

- Chapter 1: 粮仓事故 (granary incident)
- Hub: city status, not quest list
- Loop: observe → act (tap roles) → run order → world reacts

## Engineering

- `npm test`: 123 passed (local verification 2026-08-30)
- `npm run build`: pass

## Done this sprint (P0)

- Story domain (`src/domain/story`)
- Granary content (`src/content/story/granaryIncident.ts`)
- `GranaryScene` UI
- Hub city status + CTA 前往粮仓
- Repair log + next clue (驿站)
- Docs: `SPRINT5_STORY_GAMEPLAY_CORE.md`

## Not done

- Persist granary clear into GameSave
- Wire story outcome → skill evidence
- Chapter 2 station scene
- Deeper “not click-only” interactions

## Doc vs code

- Old adventure/prototype paths remain in repo but Hub primary path is Story granary.
- PROJECT_SPEC still describes Sprint 4 as current; STATUS_OVERVIEW updated to Sprint 5.
