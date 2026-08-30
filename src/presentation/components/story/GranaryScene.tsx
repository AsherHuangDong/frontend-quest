import { useEffect, useState } from 'react';
import { granaryIncident } from '../../../content/story/granaryIncident';
import { initialBoard, runProcess } from '../../../domain/story/runProcess';
import type { SceneBoard, SceneRunResult } from '../../../domain/story/types';

type Phase =
  | 'brief'
  | 'observe'
  | 'act'
  | 'running'
  | 'failed'
  | 'success'
  | 'log'
  | 'hook';

interface Props {
  onExit: () => void;
  onComplete?: () => void;
}

export function GranaryScene({ onExit, onComplete }: Props) {
  const scene = granaryIncident;
  const [phase, setPhase] = useState<Phase>('brief');
  const [board, setBoard] = useState<SceneBoard>(() => initialBoard(scene));
  const [line, setLine] = useState<string[]>([]);
  const [lastRun, setLastRun] = useState<SceneRunResult | null>(null);
  const [observeStep, setObserveStep] = useState(0);

  // Auto-play chaos observation once when entering observe
  useEffect(() => {
    if (phase !== 'observe') return;
    setObserveStep(0);
    const t1 = window.setTimeout(() => setObserveStep(1), 600);
    const t2 = window.setTimeout(() => setObserveStep(2), 1400);
    const t3 = window.setTimeout(() => setObserveStep(3), 2200);
    const t4 = window.setTimeout(() => setPhase('act'), 3000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [phase]);

  function toggleInLine(id: string) {
    setLine((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= scene.actors.length) return prev;
      return [...prev, id];
    });
  }

  function moveInLine(id: string, dir: -1 | 1) {
    setLine((prev) => {
      const i = prev.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function handleRun() {
    if (line.length !== scene.actors.length) return;
    setPhase('running');
    window.setTimeout(() => {
      const result = runProcess(scene, line);
      setLastRun(result);
      setBoard(result.board);
      setPhase(result.ok ? 'success' : 'failed');
    }, 500);
  }

  function handleRetry() {
    setLastRun(null);
    setBoard(initialBoard(scene));
    setLine([]);
    setPhase('act');
  }

  function actorLabel(id: string) {
    const actor = scene.actors.find((a) => a.id === id)!;
    const state = board.actorStates[id];
    if (state === 'done') return actor.doneLabel;
    return actor.pendingLabel;
  }

  return (
    <section className="challenge-card story-scene">
      <div className="meta-chip">
        {scene.place} · {scene.title}
      </div>
      <p className="identity-line">{scene.identityLine}</p>

      {phase === 'brief' && (
        <>
          <pre className="narration-text">{scene.briefing}</pre>
          <div className="action-bar">
            <button className="submit-button primary" onClick={() => setPhase('observe')}>
              进入粮仓
            </button>
            <button className="hint-button" onClick={onExit}>
              离开
            </button>
          </div>
        </>
      )}

      {phase === 'observe' && (
        <>
          <div className={`scene-floor${board.alarm ? ' alarm' : ''}`}>
            <div className="scene-status-bar">
              {board.alarm ? '🚨 警报响着' : '✅ 警报关闭'}
              {' · '}
              {board.gateOpen ? '仓门已开' : '仓门关闭'}
            </div>
            <div className="actor-row">
              {scene.actors.map((actor, i) => (
                <div
                  key={actor.id}
                  className={`actor-card state-${board.actorStates[actor.id]}${
                    observeStep > i ? ' pulse' : ''
                  }`}
                >
                  <div className="actor-emoji">{actor.emoji}</div>
                  <strong>{actor.name}</strong>
                  <span className="actor-role">{actor.role}</span>
                  <span className="actor-state">{actorLabel(actor.id)}</span>
                </div>
              ))}
            </div>
          </div>
          <pre className="narration-text">{scene.chaosNarration}</pre>
          <p className="soft-note">观察中…</p>
        </>
      )}

      {(phase === 'act' || phase === 'running' || phase === 'failed') && (
        <>
          <div className={`scene-floor${board.alarm ? ' alarm' : ''}`}>
            <div className="scene-status-bar">
              {board.alarm ? '🚨 警报响着' : '✅ 警报关闭'}
              {' · '}
              {board.gateOpen ? '仓门已开' : '仓门关闭'}
            </div>
            <div className="actor-row">
              {scene.actors.map((actor) => {
                const inLine = line.includes(actor.id);
                return (
                  <button
                    type="button"
                    key={actor.id}
                    className={`actor-card interactive state-${board.actorStates[actor.id]}${
                      inLine ? ' selected' : ''
                    }`}
                    disabled={phase === 'running'}
                    onClick={() => toggleInLine(actor.id)}
                  >
                    <div className="actor-emoji">{actor.emoji}</div>
                    <strong>{actor.name}</strong>
                    <span className="actor-role">{actor.role}</span>
                    <span className="actor-state">{actorLabel(actor.id)}</span>
                    <span className="actor-hint">
                      {inLine ? `已排入·第 ${line.indexOf(actor.id) + 1} 步` : '点击排入本单'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="process-line">
            <div className="process-label">今日这一单（按顺序执行）</div>
            {line.length === 0 ? (
              <p className="soft-note">点击上方人物，决定谁先谁后办理。</p>
            ) : (
              <div className="process-steps">
                {line.map((id, i) => {
                  const actor = scene.actors.find((a) => a.id === id)!;
                  return (
                    <div className="process-step" key={id}>
                      <span className="process-n">{i + 1}</span>
                      <span>
                        {actor.emoji} {actor.name}
                      </span>
                      <span className="process-controls">
                        <button
                          type="button"
                          className="hint-button reorder-btn"
                          disabled={phase === 'running' || i === 0}
                          onClick={() => moveInLine(id, -1)}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="hint-button reorder-btn"
                          disabled={phase === 'running' || i === line.length - 1}
                          onClick={() => moveInLine(id, 1)}
                        >
                          ↓
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {phase === 'failed' && lastRun && (
            <div className="banner hint">
              <pre className="narration-text">{scene.failNarration}</pre>
              <p className="npc-line">{scene.failNpcLine}</p>
            </div>
          )}

          <div className="action-bar">
            {phase === 'act' && (
              <button
                className="submit-button primary"
                disabled={line.length !== scene.actors.length}
                onClick={handleRun}
              >
                按这一单走一遍
              </button>
            )}
            {phase === 'running' && (
              <button className="submit-button" disabled>
                现场运行中…
              </button>
            )}
            {phase === 'failed' && (
              <button className="submit-button primary" onClick={handleRetry}>
                重新安排
              </button>
            )}
            <button className="hint-button" onClick={onExit} disabled={phase === 'running'}>
              离开
            </button>
          </div>
        </>
      )}

      {phase === 'success' && (
        <>
          <div className="scene-floor restored">
            <div className="scene-status-bar">✅ 警报关闭 · 仓门已开</div>
            <div className="actor-row">
              {scene.actors.map((actor) => (
                <div key={actor.id} className="actor-card state-done">
                  <div className="actor-emoji">{actor.emoji}</div>
                  <strong>{actor.name}</strong>
                  <span className="actor-state">{actor.doneLabel}</span>
                </div>
              ))}
            </div>
          </div>
          <pre className="narration-text">{scene.successNarration}</pre>
          <p className="npc-line">{scene.successNpcLine}</p>
          <div className="action-bar">
            <button className="submit-button primary" onClick={() => setPhase('log')}>
              查看修复记录
            </button>
          </div>
        </>
      )}

      {phase === 'log' && (
        <>
          <pre className="repair-log">{scene.repairLog}</pre>
          <div className="action-bar">
            <button
              className="submit-button primary"
              onClick={() => {
                onComplete?.();
                setPhase('hook');
              }}
            >
              继续
            </button>
          </div>
        </>
      )}

      {phase === 'hook' && (
        <>
          <pre className="narration-text">{scene.nextClue}</pre>
          <div className="next-clue-card">
            <span className="anomaly-eyebrow">远处</span>
            <h2>{scene.nextPlace}</h2>
            <p className="anomaly-body">警报刚刚亮起</p>
          </div>
          <div className="action-bar">
            <button className="submit-button primary" onClick={onExit}>
              返回城中
            </button>
          </div>
        </>
      )}
    </section>
  );
}
