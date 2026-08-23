import { SkillMasteryPanel } from '../components/progress/SkillMasteryPanel';
import { PlayerLevelCard } from '../components/progress/PlayerLevelCard';
import { XpProgressBar } from '../components/progress/XpProgressBar';
import { ChapterProgress } from '../components/progress/ChapterProgress';
import { usePlayerProgress } from '../hooks/usePlayerProgress';

export function ProgressPage() {
  const progress = usePlayerProgress();

  return (
    <main>
      <PlayerLevelCard player={progress.player} level={progress.level} />
      <XpProgressBar xp={progress.xp} nextLevelXp={progress.nextLevelXp} />
      <ChapterProgress chapters={progress.chapters} />
      <SkillMasteryPanel skills={progress.skills} />
    </main>
  );
}
