import { useMemo, useState } from 'react';
import type { RelationalInstance, RunOutcome, LearnedState } from './types';
import { discoveryInstance, pickApplication } from './instances';
import { runPin, initialLearned, applyApplicationCommit } from './engine';

type Phase = 'discovery' | 'application';
type Step = 'arrange' | 'committed_result';

export function RelationalLab({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>('discovery');
  const [instance, setInstance] = useState<RelationalInstance>(discoveryInstance);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('arrange');
  const [lastOutcome, setLastOutcome] = useState<RunOutcome | null>(null);
  const [learned, setLearned] = useState<LearnedState>(initialLearned());
  const [appCommitCount, setAppCommitCount] = useState(0);
  const [discoveryDone, setDiscoveryDone] = useState(false);

  const sortedSignals = useMemo(
    () => [...instance.signals].sort((a, b) => a.order - b.order),
    [instance],
  );

  function resetArrange() {
    setSelectedId(null);
    setStep('arrange');
    setLastOutcome(null);
  }

  function goApplication() {
    const app = pickApplication();
    setPhase('application');
    setInstance(app);
    setAppCommitCount(0);
    resetArrange();
  }

  function commitRun() {
    if (!selectedId) return;
    const outcome = runPin(instance, selectedId);
    setLastOutcome(outcome);
    setStep('committed_result');

    if (phase === 'discovery') {
      if (outcome.success) setDiscoveryDone(true);
      return;
    }

    const isFirst = appCommitCount === 0;
    setLearned((prev) => applyApplicationCommit(prev, outcome, isFirst));
    setAppCommitCount((c) => c + 1);
  }

  return (
    <section className="chapter-card relational-lab">
      <div className="meta-chip">
        Relational 原型 · {phase === 'discovery' ? '发现' : '迁移检验'}
      </div>
      <h2>{instance.title}</h2>
      <p className="anomaly-body">{instance.brief}</p>

      <div className="rel-status-row">
        <span>
          关系掌握（LEARNED）：{' '}
          <strong className={learned.learned ? 'ok' : 'bad'}>
            {learned.learned ? '是（首次迁移命中）' : '否'}
          </strong>
        </span>
        {learned.clearedBySearch && !learned.learned && (
          <span className="muted"> · 曾靠搜索取满（不计学会）</span>
        )}
      </div>

      {step === 'arrange' && (
        <>
          <p className="rel-hint">
            选定下游在<strong>哪一个信号出现时</strong>取用载荷，然后锁定运转。
            一次只能钉一个信号。
          </p>
          <div className="rel-signal-list">
            {sortedSignals.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={selectedId === s.id ? 'rel-signal selected' : 'rel-signal'}
                onClick={() => setSelectedId(s.id)}
              >
                <span className="rel-ord">{idx + 1}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
          <div className="hub-actions anomaly-actions">
            <button
              className="submit-button primary"
              disabled={!selectedId}
              onClick={commitRun}
            >
              锁定并运转
            </button>
            <button className="hint-button" onClick={onExit}>
              离开
            </button>
          </div>
        </>
      )}

      {step === 'committed_result' && lastOutcome && (
        <>
          <div
            className={
              lastOutcome.success ? 'result success' : 'result failure'
            }
          >
            <h3>{lastOutcome.success ? '取到有效载荷' : '取用为空'}</h3>
            <p>
              {lastOutcome.success
                ? '这一次，在该信号出现时下游拿到了可用结果。'
                : '该信号出现时取用，载荷为空。有效载荷出现在别的信号上——但本轮已锁定，不能改。'}
            </p>
            {phase === 'application' && appCommitCount === 1 && (
              <p>
                <strong>
                  {lastOutcome.success
                    ? '首次迁移 Commit 命中 → 记为已掌握关系。'
                    : '首次迁移 Commit 未中 → 不计学会（即使稍后扫到也不计）。'}
                </strong>
              </p>
            )}
          </div>
          <div className="hub-actions anomaly-actions">
            {phase === 'discovery' && discoveryDone && (
              <button className="submit-button primary" onClick={goApplication}>
                进入异地复核（计分）
              </button>
            )}
            <button className="hint-button" onClick={resetArrange}>
              {phase === 'application' ? '再次安排（不计首次）' : '重新安排'}
            </button>
            {phase === 'application' && (
              <button className="hint-button" onClick={goApplication}>
                换一套异地题（重置首次计数）
              </button>
            )}
            <button className="hint-button" onClick={onExit}>
              回城
            </button>
          </div>
        </>
      )}
    </section>
  );
}
