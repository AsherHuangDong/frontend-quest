import { AsyncStateView } from '../components/common/AsyncStateView';
import { PageContainer } from '../components/common/PageContainer';

export function QuestPage() {
  const state = {
    status: 'success' as const,
    data: []
  };

  return (
    <PageContainer>
      <AsyncStateView
        state={state}
        render={() => (
          <section>
            <h1>Quests</h1>
          </section>
        )}
      />
    </PageContainer>
  );
}
