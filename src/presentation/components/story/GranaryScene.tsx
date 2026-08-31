import { useEffect, useRef, useState } from 'react';
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

const STEP_MS = 420;

export function GranaryScene({ onExit, onComplete }: Props) {
  const scene = granaryIncident;
  const [phase, setPhase] = useState<Phase>('brief');
  const [board, setBoard] = useState<SceneBoard>(() => initialBoard(scene));
  const [line, setLine] = useState<string[]>([]);
  const [lastRun, setLastRun] = useState<SceneRunResult | null>(null);
  const [observeStep, setObserveStep] = useState(0);
  /** Which process step index is lit during run (-1 = none). */
  const [runHighlight, setRunHighlight] = useState(-1);
  const [runStatusText, setRunStatusText] = useState('');
  const [attempt, setAttempt] = useState(0);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  // Auto-play chaos observation
  useEffect(() => {
    if (phase !== 'observe') return;
    setObserveStep(0);
    const t1 = window.setTimeout(() => setObserveStep(1), 500);
    const t2 = window.setTimeout(() => setObserveStep(2), 1100);
    const t3 = window.setTimeout(() => setObserveStep(3), 1700);
    const t4 = window.setTimeout(() => setPhase('act'), 2400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [phase]);

  function toggleInLine(id: string) {
    if (phase !== 'act') return;
    setLine((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= scene.actors.length) return prev;
      return [...prev, id];
    });
  }

  function moveInLine(id: string, dir: -1 | 1) {
    if (phase !== 'act') return;
    setLine((prev) => {
      const i = prev.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  }

  function handleRun() {
    if (line.length !== scene.actors.length || phase !== 'act') return;
    clearTimers();
    setPhase('running');
    setRunHighlight(-1);
    setRunStatusText('开始按这一单办理…');
    setLastRun(null);

    const result = runProcess(scene, line);
    const order = [...line];

    order.forEach((id, i) => {
      const actor = scene.actors.find((a) => a.id === id)!;
      const tid = window.setTimeout(() => {
        setRunHighlight(i);
        setRunStatusText(`第 ${i + 1} 步：${actor.name}在办理…`);
        // progressive board hint during run
        setBoard((prev) => {
          const actorStates = { ...prev.actorStates };
          for (let k = 0; k <= i; k++) {
            const stepId = order[k]!;
            actorStates[stepId] = 'done';
          }
          return {
            ...prev,
            actorStates,
            alarm: true,
            gateOpen: false,
          };
        });
      }, STEP_MS * (i + 1));
      timers.current.push(tid);
    });

    const endId = window.setTimeout(() => {
      setLastRun(result);
      setBoard(result.board);
      setRunHighlight(-1);
      setRunStatusText('');
      setPhase(result.ok ? 'success' : 'failed');
      if (!result.ok) setAttempt((a) => a + 1);
    }, STEP_MS * (order.length + 1) + 200);
    timers.current.push(endId);
  }

  function handleRetry() {
    clearTimers();
    setLastRun(null);
    setBoard(initialBoard(scene));
    setLine([]);
    setRunHighlight(-1);
    setRunStatusText('');
    setPhase('act');
  }

  function actorLabel(id: string) {
    const actor = scene.actors.find((a) => a.id === id)!;
    const state = board.actorStates[id];
    if (state === 'done') return actor.doneLabel;
    return actor.pendingLabel;
  }

  function failDetail(): string {
    if (!lastRun || lastRun.ok) return '';
    // Point at which world link is empty in plain language
    const wrong = scene.actors.filter((a) => lastRun.board.actorStates[a.id] === 'wrong');
    if (wrong.length === 0) {
      return '这一单的顺序还对不上，现场没法收口。';
    }
    return `出问题的一环：${wrong.map((a) => a.name).join('、')}——该完成的还没完成，后面就乱了。`;
  }

  const canRun = line.length === scene.actors.length && phase === 'act';

  return (
    <section className="challenge-card story-scene">
      <div className="meta-chip">
        {scene.place} · {scene.title}
      </div>
      <p className="identity-line">{scene.identityLine}</p>

      {phase === 'brief' && (
        <>
          <div className="onboard-card">
            <p className="onboard-lead">{scene.briefing}</p>
            <ol className="onboard-steps">
              <li>
                <strong>问题</strong>
                <span>钱、账、货三处对不上，警报还在响。</span>
              </li>
              <li>
                <strong>你能做的</strong>
                <span>点选人物，排出这一单谁先谁后。</span>
              </li>
              <li>
                <strong>然后</strong>
                <span>点「按这一单走一遍」，看现场怎么变。</span>
              </li>
            </ol>
          </div>
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
          <p className="soft-note live-hint">正在看现场…马上轮到你安排。</p>
        </>
      )}

      {(phase === 'act' || phase === 'running' || phase === 'failed') && (
        <>
          <div className={`scene-floor${board.alarm ? ' alarm' : ''}${phase === 'running' ? ' running' : ''}`}>
            <div className="scene-status-bar">
              {phase === 'running' && runStatusText
                ? runStatusText
                : `${board.alarm ? '🚨 警报响着' : '✅ 警报关闭'} · ${
                    board.gateOpen ? '仓门已开' : '仓门关闭'
                  }`}
            </div>
            <div className="actor-row">
              {scene.actors.map((actor) => {
                const inLine = line.includes(actor.id);
                const stepIdx = line.indexOf(actor.id);
                const isLit = phase === 'running' && stepIdx === runHighlight;
                return (
                  <button
                    type="button"
                    key={actor.id}
                    className={`actor-card interactive state-${board.actorStates[actor.id]}${
                      inLine ? ' selected' : ''
                    }${isLit ? ' run-lit' : ''}`}
                    disabled={phase !== 'act'}
                    onClick={() => toggleInLine(actor.id)}
                  >
                    <div className="actor-emoji">{actor.emoji}</div>
                    <strong>{actor.name}</strong>
                    <span className="actor-role">{actor.role}</span>
                    <span className="actor-state">{actorLabel(actor.id)}</span>
                    {phase === 'act' && (
                      <span className="actor-hint">
                        {inLine ? `已排入 · 第 ${stepIdx + 1} 步` : '点一下排入'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="process-line">
            <div className="process-label">今日这一单（按顺序执行）</div>
            {line.length === 0 ? (
              <p className="soft-note">点上面的人，决定谁先谁后。三人都要排进单里。</p>
            ) : (
              <div className="process-steps">
                {line.map((id, i) => {
                  const actor = scene.actors.find((a) => a.id === id)!;
                  const lit = phase === 'running' && i === runHighlight;
                  return (
                    <div className={`process-step${lit ? ' active-step' : ''}`} key={id}>
                      <span className="process-n">{i + 1}</span>
                      <span>
                        {actor.emoji} {actor.name}
                      </span>
                      {phase === 'act' && (
                        <span className="process-controls">
                          <button
                            type="button"
                            className="hint-button reorder-btn"
                            disabled={i === 0}
                            onClick={() => moveInLine(id, -1)}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="hint-button reorder-btn"
                            disabled={i === line.length - 1}
                            onClick={() => moveInLine(id, 1)}
                          >
                            ↓
                          </button>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {phase === 'act' && line.length > 0 && line.length < scene.actors.length && (
              <p className="soft-note live-hint">
                还差 {scene.actors.length - line.length} 人，排满才能运转。
              </p>
            )}
            {phase === 'act' && canRun && (
              <p className="soft-note live-hint ok-hint">排好了。点下面按钮，看现场会怎样。</p>
            )}
          </div>

          {phase === 'failed' && lastRun && (
            <div className="banner fail-banner">
              <strong className="fail-title">这一单对不上</strong>
              <pre className="narration-text">{scene.failNarration}</pre>
              <p className="fail-detail">{failDetail()}</p>
              <p className="npc-line">{scene.failNpcLine}</p>
              {attempt === 1 && (
                <p className="soft-note">第一次对不上很正常。改改顺序，再走一遍就好。</p>
              )}
            </div>
          )}

          <div className="action-bar">
            {phase === 'act' && (
              <button
                className="submit-button primary"
                disabled={!canRun}
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
                再试一次
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
                <div key={actor.id} className="actor-card state-done pulse">
                  <div className="actor-emoji">{actor.emoji}</div>
                  <strong>{actor.name}</strong>
                  <span className="actor-state">{actor.doneLabel}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="banner success-banner">
            <strong className="success-title">三处对上了</strong>
            <pre className="narration-text">{scene.successNarration}</pre>
            <p className="npc-line">{scene.successNpcLine}</p>
            <p className="soft-note">你让该先办完的事先办完，这一单才能收口。</p>
          </div>
          <div className="action-bar">
            <button className="submit-button primary" onClick={() => setPhase('log')}>
              看看发生了什么
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
