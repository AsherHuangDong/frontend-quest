import type { BossDefinition, BossProgress } from '../../domain/boss/types';
import { getPhaseStatus } from '../../domain/boss/stateMachine';

interface BossPanelProps {
  boss: BossDefinition;
  progress: BossProgress;
  onStart: () => void;
}

export function BossPanel({ boss, progress, onStart }: BossPanelProps) {
  return (
    <section aria-label="Boss">
      <h2>👹 {boss.title}</h2>
      <p>{boss.description}</p>
      <p>通关奖励：+{boss.rewardXp} XP</p>

      <ol>
        {boss.phases.map((phase, index) => {
          const status = getPhaseStatus(boss, progress, index);
          const score = progress.phaseScores[phase.id];
          return (
            <li key={phase.id}>
              <strong>{phase.title}</strong>{' '}
              {status === 'CLEARED' && `✓ ${score} 分`}
              {status === 'ACTIVE' && (progress.status === 'AVAILABLE' ? '可挑战' : '进行中')}
              {status === 'LOCKED' && '🔒'}
            </li>
          );
        })}
      </ol>

      {progress.status === 'AVAILABLE' && <button onClick={onStart}>开始 Boss 战</button>}
      {progress.status === 'IN_PROGRESS' && <p>完成当前阶段即可解锁下一阶段。</p>}
      {progress.status === 'CLEARED' && <p>🏆 Boss 已击败！</p>}
    </section>
  );
}
