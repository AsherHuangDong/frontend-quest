# Relational Prototype

Implements the frozen minimal Relational scene:

- **True rule R:** only the ready-role signal yields a full load.
- **Discovery:** three signals; sweep allowed; does **not** set LEARNED.
- **Application:** shuffled pool A1/A2/A3 (ready at different ordinals); IDs disjoint from discovery.
- **LEARNED(R):** first Commit on a scoring Application instance hits ready and full. Later search success only sets `clearedBySearch`.

Anti-memory: no stable “always pick k-th”; no reuse of discovery signal ids.

Entry: Hub → Relational 原型.

Does not modify XP / GameSave. Session-local React state only.

## Files

- `src/prototype/relational/types.ts`
- `src/prototype/relational/instances.ts`
- `src/prototype/relational/engine.ts`
- `src/prototype/relational/engine.test.ts`
- `src/prototype/relational/RelationalLab.tsx`
