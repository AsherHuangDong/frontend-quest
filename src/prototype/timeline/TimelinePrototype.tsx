import { useState } from 'react';
import { volume1Scenes } from './scenes';
import { runScene } from './evaluate';
import type { RunResult, TimelineScene } from './types';

type Phase = 'entry' | 'floor' | 'running' | 'chaos' | 'settled' | 'done';

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
        <div className="meta-chip">时序初章 · 原型</div>
        <div className="result success">
          <h2>三处都稳了</h2>
          <pre className="narration-text result-narration">
            {城卫队长在门口等你：以前总觉是人偷懒，现在看，是「事与事的先后」没理清。`}
          </pre>
          <div className="action-bar">
            <button className="submit-button primary" onClick={onExit}>
              离开原型
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="challenge-card adventure-lab">
      <div className="meta-chip">
        {scene.place} · {scene.title}
      </div>

      {phase === 'entry' && (
        <>
          <div className="adventure-narration">
            <pre className="narration-text">{scene.entry}</pre>
          </div>
          <div className="action-bar">
            <button className="submit-button primary" onClick={() => setPhase('floor')}>
              看现场
            </button>
            <button className="hint-button" onClick={onExit}>
              离开
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
                  <span className="status-dot">{state === 'stable' ? '●' : '●'}</span>
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
                    ↑
                  </button>
                  <button
                    type="button"
                    className="hint-button reorder-btn"
                    disabled={phase === 'running' || i === order.length - 1}
                    onClick={() => move(id, 1)}
                  >
                    ↓
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
                让现场运转一次
              </button>
            )}
            {phase === 'running' && (
              <button className="submit-button" disabled>
                运转中…
              </button>
            )}
            {phase === 'chaos' && (
              <button className="submit-button primary" onClick={handleRetry}>
                再试
              </button>
            )}
            <button className="hint-button" onClick={onExit} disabled={phase === 'running'}>
              离开
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
                <span className="status-dot">●</span>
                <span>{s.stableLabel}</span>
              </div>
            ))}
          </div>
          <div className="action-bar">
            <button className="submit-button primary" onClick={handleAdvance}>
              {isLast ? '结束这一天' : '前往下一处'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
