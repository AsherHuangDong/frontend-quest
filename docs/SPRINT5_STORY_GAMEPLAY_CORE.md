# Sprint 5 — Story & Gameplay Core

> Status: **P0 implementing**  
> Date: 2026-08-30

## Goal

Validate H1 via story + world state + player action + knowledge discovery — not a prettier quiz.

## Product principles

1. Story is not packaging; the incident comes first.
2. Knowledge is a world rule the player discovers.
3. Actions change the world; success is visible repair, not +XP alone.
4. Failure is the world running the wrong process, with NPC reaction.

## P0 scope

| ID | Item | Status |
|---|---|---|
| P0-1 | Story scene model | ✅ |
| P0-2 | Chapter 1 granary data | ✅ |
| P0-3 | Scene UI (roles on stage) | ✅ |
| P0-4 | Action → world state | ✅ |
| P0-5 | Fail → retry | ✅ |
| P0-6 | Success world restore | ✅ |
| P0-7 | Repair log | ✅ |
| P0-8 | Hook to next incident | ✅ |
| P0-9 | Hub as city status | ✅ |
| P0-10 | Keep XP/save path optional; no save break | ✅ |

## Player loop

Observe chaos (auto) → assign who works when (tap roles into process line) → run the order → world reacts → retry or repair log + station clue.

## Out of scope

IDE, AI, full world map, chapters 2–N full content, Monaco.

## Technical truth (internal only)

Granary correct process = payment confirmed → ledger → ship (Promise chain dependency).
