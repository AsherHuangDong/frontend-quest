# Sprint 5 — Story & Gameplay Core

> Status: **P0 shipped (pending human H1)**  
> Date: 2026-08-30

## Goal

Validate H1 via story + world state + player action + knowledge discovery.

## Principles

1. Incident first, not quiz packaging.
2. Knowledge = world rule discovered through outcomes.
3. Success = visible repair + archive log + next clue.
4. Failure = world still broken + NPC line.

## Player flow (Chapter 1)

```
Hub (city status)
 → 前往粮仓
 → briefing / identity
 → auto observe chaos
 → tap roles into 今日这一单
 → 按这一单走一遍
 → fail → NPC → rearrange
 → success → restore floor
 → repair log
 → station clue
 → back to hub (granary green, station red)
```

## Files

- `src/domain/story/*`
- `src/content/story/granaryIncident.ts`
- `src/presentation/components/story/GranaryScene.tsx`
- Hub in `src/App.tsx`

## Tests

- `src/domain/story/runProcess.test.ts`
- Full suite + build green as of 2026-08-30

## Limits

- Granary clear is session state (not GameSave yet)
- Still process-line based (roles are people, but order is explicit)
- Station chapter not implemented

## Next

1. Human playtest H1 questions from the sprint brief
2. Persist clear + optional evidence
3. Station scene if H1 holds
