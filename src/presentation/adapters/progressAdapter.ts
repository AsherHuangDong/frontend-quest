import type { Player } from '../../domain/player/types';
import type { ProgressMap } from '../../domain/progress/types';
import type { SkillMasteryMap } from '../../domain/skill/types';

interface Input {
  player: Player;
  progress: ProgressMap;
  skillMastery: SkillMasteryMap;
}

export function toProgressViewModel({ player, progress, skillMastery }: Input) {
  return {
    player,
    level: Math.floor(player.xp / 100) + 1,
    xp: player.xp,
    nextLevelXp: (Math.floor(player.xp / 100) + 1) * 100,
    chapters: Object.values(progress),
    skills: skillMastery,
  };
}
