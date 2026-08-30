import { useState } from 'react';
import type { AdventureChapter, AdventureEvaluationResult } from '../../../domain/adventure/types';
import { evaluateChapterOrder } from '../../../domain/adventure/evaluate';

type LabPhase = 'intro' | 'lab' | 'running' | 'failed' | 'success';

interface AdventureLabProps {
  chapter: AdventureChapter;
  onBack: () => void;
  onSuccess?: () => void;
}

export function AdventureLab({ chapter, onBack, onSuccess }: AdventureLabProps) {
  const [phase, setPhase] = useState<LabPhase>('intro');
  const [order, setOrder] = useState<string[]>([...chapter.initialOrder]);
  const [evaluation, setEvaluation] = useState<AdventureEvaluationResult | null>(null);
  const [persisted, setPersisted] = useState(false);

  const statusKeys = chapter.statusPanel.map((s) => s.key);

  function move(id: string, direction: -1 | 1) {
    setOrder((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      const next = idx + direction;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  }

  function handleRun() {
    setPhase('running');
    window.setTimeout(() => {
      const result = evaluateChapterOrder(order, chapter.correctOrder, statusKeys);
      setEvaluation(result);
      if (result.success) {
        setPhase('success');
        if (!persisted) {
          onSuccess?.();
          setPersisted(true);
        }
      } else {
        setPhase('failed');
      }
    }, 420);
  }

  function handleRetry() {
    setEvaluation(null);
    setPhase('lab');
  }

  function labelFor(id: string) {
    return chapter.actions.find((a) => a.id === id)?.label ?? id;
  }

  function codeHintFor(id: string) {
    return chapter.actions.find((a) => a.id === id)?.codeHint ?? id;
  }

  return (
    <section className="challenge-card adventure-lab">
      <div className="meta-chip">
        第 {chapter.chapterNumber} 章 · {chapter.title}
      </div>
      <div className="meta-chip learn-chip">
        本章知识：{chapter.learnTopic}
      </div>

      {phase === 'intro' && (
        <>
          <div className="adventure-narration">
            <pre className="narration-text">{chapter.intro}</pre>
          </div>
          <div className="action-bar">
            <button className="submit-button primary" onClick={() => setPhase('lab')}>
              开始重排
            </button>
            <button className="hint-button" onClick={onBack}>
              返回
            </button>
          </div>
        </>
      )}

      {(phase === 'lab' || phase === 'running' || phase === 'failed') && (
        <>
          <h2 className="lab-title">按执行顺序重排</h2>
          <p className="lab-hint">
            每张卡 = 一步。用 ↑ ↓ 调整后点「唤起时序」，看状态面板是否全绿。
          </p>

          <div className="status-panel">
            {chapter.statusPanel.map((item, index) => {
              const state =
                evaluation?.status[item.key] ??
                (index === 0 ? 'success' : 'fail');
              const label = state === 'success' ? item.successLabel : item.failLabel;
              return (
                <div
                  key={item.key}
                  className={`status-item ${state === 'success' ? 'ok' : 'bad'}`}
                >
                  <span className="status-dot">{state === 'success' ? '✅' : '❌'}</span>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>

          <div className="reorder-list">
            {order.map((id, index) => (
              <div className="reorder-card" key={id}>
                <div className="reorder-index">{index + 1}</div>
                <div className="reorder-body">
                  <strong>{labelFor(id)}</strong>
                  <small>
                    对应代码：<code>{codeHintFor(id)}</code>
                  </small>
                </div>
                <div className="reorder-controls">
                  <button
                    type="button"
                    className="hint-button reorder-btn"
                    disabled={phase === 'running' || index === 0}
                    onClick={() => move(id, -1)}
                    aria-label="上移"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="hint-button reorder-btn"
                    disabled={phase === 'running' || index === order.length - 1}
                    onClick={() => move(id, 1)}
                    aria-label="下移"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>

          {phase === 'failed' && evaluation && (
            <div className="banner hint">
              <pre className="narration-text">{chapter.failNarration}</pre>
            </div>
          )}

          <div className="action-bar">
            {phase === 'lab' && (
              <button className="submit-button primary" onClick={handleRun}>
                唤起时序（运行）
              </button>
            )}
            {phase === 'running' && (
              <button className="submit-button" disabled>
                时序唤起中…
              </button>
            )}
            {phase === 'failed' && (
              <button className="submit-button primary" onClick={handleRetry}>
                再排一次
              </button>
            )}
            <button className="hint-button" onClick={onBack} disabled={phase === 'running'}>
              返回
            </button>
          </div>
        </>
      )}

      {phase === 'success' && evaluation && (
        <div className="result success">
          <div className="result-icon">✅</div>
          <h2>法则铭刻</h2>
          <pre className="narration-text result-narration">{chapter.successNarration}</pre>

          <div className="status-panel success-panel">
            {chapter.statusPanel.map((item) => (
              <div key={item.key} className="status-item ok">
                <span className="status-dot">✅</span>
                <span>{item.successLabel}</span>
              </div>
            ))}
          </div>

          <div className="action-bar">
            <button className="submit-button primary" onClick={onBack}>
              返回城中
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
