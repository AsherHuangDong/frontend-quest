import { SkillMasteryPanel } from '../components/progress/SkillMasteryPanel';
import { PlayerLevelCard } from '../components/progress/PlayerLevelCard';
import { XpProgressBar } from '../components/progress/XpProgressBar';
import { ChapterProgress } from '../components/progress/ChapterProgress';
import { AsyncStateView } from '../components/common/AsyncStateView';
import { PageContainer } from '../components/common/PageContainer';
import { usePlayerProgress } from '../hooks/usePlayerProgress';

export function ProgressPage() {
  const progress = usePlayerProgress();

  return (
    <PageContainer>
      <AsyncStateView
        state={{ status: 'success' as const, data: progress }}
        render={(data) => (
          <>
            <PlayerLevelCard player={data.player} level={data.level} />
            <XpProgressBar xp={data.xp} nextLevelXp={data.nextLevelXp} />
            <ChapterProgress chapters={data.chapters} />
            <SkillMasteryPanel skills={data.skills} />
          </>
        )}
      />
    </PageContainer>
  );
}
