import { useState } from 'react';
import { volume1Scenes } from './scenes';
import { runScene } from './evaluate';
import type { RunResult, TimelineScene } from './types';

type Phase = 'entry' | 'floor' | 'running' | 'chaos' | 'settled' | 'done';

const DONE_LINE =
  '\u57ce\u536b\u961f\u957f\u5728\u95e8\u53e3\u7b49\u4f60\uff1a\u4ee5\u524d\u603b\u89c9\u662f\u4eba\u5077\u61d2\uff0c\u73b0\u5728\u770b\uff0c\u662f\u300c\u4e8b\u4e0e\u4e8b\u7684\u5148\u540e\u300d\u6ca1\u7406\u6e05\u3002';

interface Props {
  onExit: () => void;
}

export function TimelinePrototype({ onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('entry');
  const [order, setOrder] = useState<string[]>(() => [...volume1Scenes[0].initialOrder]);
  const [result, setResult] = useState<RunResult | null>(null);

  const scene: TimelineScene = volume1Scenes[index];
  const isLast = index >= volume1Scenes.length - 1;

  function loadScene(nextIndex: number) {
    const next = volume1Scenes[nextIndex];
    setIndex(nextIndex);
    setOrder([...next.initialOrder]);
    setResult(null);
    setPhase('entry');
  }

  function move(id: string, dir: -1 | 1) {
    setOrder((prev) => {
      const i = prev.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function handleRun() {
    setPhase('running');
    window.setTimeout(() => {
      const r = runScene(scene, order);
      setResult(r);
      setPhase(r.ok ? 'settled' : 'chaos');
    }, 380);
  }

  function handleRetry() {
    setResult(null);
    setPhase('floor');
  }

  function handleAdvance() {
    if (isLast) {
      setPhase('done');
      return;
    }
    loadScene(index + 1);
  }

  function labelOf(id: string) {
    return scene.steps.find((s) => s.id === id)?.label ?? id;
  }

  function inscriptionOf(id: string) {
    return scene.steps.find((s) => s.id === id)?.inscription;
  }

  if (phase === 'done') {
    return (
      <section className="challenge-card adventure-lab">
        <div className="meta-chip">\u65f6\u5e8f\u521d\u7ae0 \u00b7 \u539f\u578b</div>
        <div className="result success">
          <h2>\u4e09\u5904\u90fd\u7a33\u4e86</h2>
          <pre className="narration-text result-narration">{DONE_LINE}</pre>
          <div className="action-bar">
            <button className="submit-button primary" onClick={onExit}>
              \u79bb\u5f00\u539f\u578b
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="challenge-card adventure-lab">
      <div className="meta-chip">
        {scene.place} \u00b7 {scene.title}
      </div>

      {phase === 'entry' && (
        <>
          <div className="adventure-narration">
            <pre className="narration-text">{scene.entry}</pre>
          </div>
          <div className="action-bar">
            <button className="submit-button primary" onClick={() => setPhase('floor')}>
              \u770b\u73b0\u573a
            </button>
            <button className="hint-button" onClick={onExit}>
              \u79bb\u5f00
            </button>
          </div>
        </>
      )}

      {(phase === 'floor' || phase === 'running' || phase === 'chaos') && (
        <>
          <div className="status-panel">
            {scene.statuses.map((s, i) => {
              const state =
                result?.board[s.key] ?? (i === 0 ? 'stable' : 'chaos');
              const text = state === 'stable' ? s.stableLabel : s.chaosLabel;
              return (
                <div
                  key={s.key}
                  className={`status-item ${state === 'stable' ? 'ok' : 'bad'}`}
                >
                  <span className="status-dot">\u25cf</span>
                  <span>{text}</span>
                </div>
              );
            })}
          </div>

          <div className="reorder-list">
            {order.map((id, i) => (
              <div className="reorder-card" key={id}>
                <div className="reorder-index">{i + 1}</div>
                <div className="reorder-body">
                  <strong>{labelOf(id)}</strong>
                  {inscriptionOf(id) && (
                    <small>
                      <code>{inscriptionOf(id)}</code>
                    </small>
                  )}
                </div>
                <div className="reorder-controls">
                  <button
                    type="button"
                    className="hint-button reorder-btn"
                    disabled={phase === 'running' || i === 0}
                    onClick={() => move(id, -1)}
                  >
                    \u2191
                  </button>
                  <button
                    type="button"
                    className="hint-button reorder-btn"
                    disabled={phase === 'running' || i === order.length - 1}
                    onClick={() => move(id, 1)}
                  >
                    \u2193
                  </button>
                </div>
              </div>
            ))}
          </div>

          {phase === 'chaos' && (
            <div className="banner hint">
              <pre className="narration-text">{scene.stillChaos}</pre>
            </div>
          )}

          <div className="action-bar">
            {phase === 'floor' && (
              <button className="submit-button primary" onClick={handleRun}>
                \u8ba9\u73b0\u573a\u8fd0\u8f6c\u4e00\u6b21
              </button>
            )}
            {phase === 'running' && (
              <button className="submit-button" disabled>
                \u8fd0\u8f6c\u4e2d\u2026
              </button>
            )}
            {phase === 'chaos' && (
              <button className="submit-button primary" onClick={handleRetry}>
                \u518d\u8bd5
              </button>
            )}
            <button className="hint-button" onClick={onExit} disabled={phase === 'running'}>
              \u79bb\u5f00
            </button>
          </div>
        </>
      )}

      {phase === 'settled' && (
        <div className="result success">
          <pre className="narration-text result-narration">{scene.settled}</pre>
          <div className="status-panel success-panel">
            {scene.statuses.map((s) => (
              <div key={s.key} className="status-item ok">
                <span className="status-dot">\u25cf</span>
                <span>{s.stableLabel}</span>
              </div>
            ))}
          </div>
          <div className="action-bar">
            <button className="submit-button primary" onClick={handleAdvance}>
              {isLast ? '\u7ed3\u675f\u8fd9\u4e00\u5929' : '\u524d\u5f80\u4e0b\u4e00\u5904'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
