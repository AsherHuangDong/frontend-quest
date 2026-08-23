import type { Player } from '../../../domain/player/types';

export function PlayerLevelCard({ player, level }: { player: Player; level: number }) {
  return <section>{player.name} - Lv.{level}</section>;
}
