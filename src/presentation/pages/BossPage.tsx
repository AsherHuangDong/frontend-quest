import { AsyncStateView } from '../components/common/AsyncStateView';
import { PageContainer } from '../components/common/PageContainer';
import { BossCard } from '../components/boss/BossCard';

export function BossPage() {
  const state = {
    status: 'success' as const,
    data: {
      name: 'Boss',
      phase: 'initial'
    }
  };

  return (
    <PageContainer>
      <AsyncStateView
        state={state}
        render={(boss) => <BossCard name={boss.name} phase={boss.phase} />}
      />
    </PageContainer>
  );
}
