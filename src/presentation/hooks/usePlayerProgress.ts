import { useGameStore } from '../../application/gameStore';
import { toProgressViewModel } from '../adapters/progressAdapter';

export function usePlayerProgress() {
  const player = useGameStore((state) => state.player);
  const progress = useGameStore((state) => state.progress);
  const skillMastery = useGameStore((state) => state.skillMastery);

  return toProgressViewModel({ player, progress, skillMastery });
}
