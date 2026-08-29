import { useMemo, useState } from 'react';
import { useGameStore, getQuest } from './application/gameStoreV2';
import { getLevelProgress } from './domain/player/level';
import { listDueKnowledgeNodeIds } from './domain/review/review';
import type { Challenge } from './domain/quest/types';
import type { CalibrationAnswer } from './domain/calibration/types';
import { quests } from './content/quests';
import { asyncWorldCalibration } from './content/calibration/asyncWorld';
import { selectNextQuest } from './application/useCases/getNextQuest';
import { evaluateChallenge } from './domain/quest/evaluator';
import { buildResultCopy } from './presentation/experience/resultCopy';
import { skillLabel } from './presentation/experience/skillLabels';
import { FeedbackContainer } from './presentation/components/feedback/FeedbackContainer';
import './styles.css';

type Screen = 'hub' | 'calibrate' | 'quest';

function ChallengeContent({
  challenge,
  selectedAnswer,
  onSelect,
  locked,
}: {
  challenge: Challenge;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  locked?: boolean;
}) {
  if (challenge.type === 'code') {
    return (
      <div className="result failure">
        <div className="result-icon">🛠️</div>
        <span>CODE CHALLENGE</span>
        <h2>代码题即将开放</h2>
      </div>
    );
  }

  return (
    <>
      <h2 className="question-text">{challenge.question}</h2>
      <div className="options">
        {challenge.options.map((option) => (
          <button
            className={selectedAnswer === option.id ? 'selected' : ''}
            key={option.id}
            disabled={locked || Boolean(selectedAnswer)}
            onClick={() => onSelect(option.id)}
          >
            <span>{option.id}</span>
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}

function statusLabel(status: string) {
  if (status === 'cleared') return '已通关';
  if (status === 'available') return '可挑战';
  return '未解锁';
}

export default function App() {
  const player = useGameStore((state) => state.player);
  const progress = useGameStore((state) => state.progress);
  const runtime = useGameStore((state) => state.runtime);
  const adaptive = useGameStore((state) => state.adaptive);
  const skillMastery = useGameStore((state) => state.skillMastery);
  const currentStreak = useGameStore((state) => state.currentStreak);
  const bestStreak = useGameStore((state) => state.bestStreak);
  const startQuest = useGameStore((state) => state.startQuest);
  const selectAnswer = useGameStore((state) => state.selectAnswer);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const exitQuest = useGameStore((state) => state.exitQuest);
  const retryQuest = useGameStore((state) => state.retryQuest);
  const useHint = useGameStore((state) => state.useHint);
  const finishCalibration = useGameStore((state) => state.finishCalibration);

  const [screen, setScreen] = useState<Screen>('hub');
  const [calibIndex, setCalibIndex] = useState(0);
  const [calibAnswers, setCalibAnswers] = useState<CalibrationAnswer[]>([]);
  const [calibSelected, setCalibSelected] = useState<string | null>(null);
  const [calibDone, setCalibDone] = useState(false);

  const levelProgress = getLevelProgress(player.xp);
  const level = levelProgress.level;
  const activeQuest = runtime ? getQuest(runtime.questId) : undefined;
  const now = useMemo(() => new Date().toISOString(), [runtime?.result, adaptive.review]);
  const dueNodes = listDueKnowledgeNodeIds(adaptive.review, now);

  const clearedCount = quests.filter((q) => progress[q.id]?.status === 'cleared').length;
  const availableCount = quests.filter((q) => progress[q.id]?.status === 'available').length;
  const questTotal = quests.length;
  const clearPercent = questTotal === 0 ? 0 : Math.round((clearedCount / questTotal) * 100);

  const nextQuest = selectNextQuest({
    quests,
    progress,
    calibration: adaptive.calibration,
    review: adaptive.review,
    now,
  });

  const calibrationQuests = asyncWorldCalibration.questIds
    .map((id) => getQuest(id))
    .filter(Boolean);

  const resultCopy =
    runtime?.result && activeQuest
      ? buildResultCopy(activeQuest, runtime.result, {
          hintsUsed: runtime.hintsUsed,
          attempts: progress[activeQuest.id]?.attempts ?? 1,
        })
      : null;

  function openQuest(questId: string) {
    startQuest(questId);
    setScreen('quest');
  }

  function startCalibration() {
    setCalibIndex(0);
    setCalibAnswers([]);
    setCalibSelected(null);
    setCalibDone(false);
    setScreen('calibrate');
  }

  function submitCalibrationStep() {
    const quest = calibrationQuests[calibIndex];
    if (!quest || !calibSelected) return;

    const evaluation = evaluateChallenge(quest.challenge, calibSelected);
    const nextAnswers: CalibrationAnswer[] = [
      ...calibAnswers,
      {
        questId: quest.id,
        score: evaluation.score,
        passed: evaluation.passed,
      },
    ];

    if (calibIndex + 1 >= calibrationQuests.length) {
      finishCalibration(nextAnswers);
      setCalibAnswers(nextAnswers);
      setCalibDone(true);
      setCalibSelected(null);
      return;
    }

    setCalibAnswers(nextAnswers);
    setCalibIndex(calibIndex + 1);
    setCalibSelected(null);
  }

  const masteryEntries = Object.values(skillMastery);

  return (
    <>
      <FeedbackContainer />
      <main className="app-shell">
        <header className="topbar">
          <div>
            <span className="eyebrow">FRONTEND QUEST · MVP</span>
            <h1>Async World</h1>
          </div>
          <div className="player-stats">
            <div className="player-card">
              <span>Lv.{level}</span>
              <strong>{player.xp} XP</strong>
            </div>
            <div className="streak-card">
              <span>🔥 连胜</span>
              <strong>{currentStreak}</strong>
              <small>最高 {bestStreak}</small>
            </div>
          </div>
        </header>

        {screen === 'hub' && (
          <section className="chapter-card hub">
            <div className="banner onboarding">
              <h2>把前端异步知识练成可闯关的能力</h2>
              <p>
                先做一次快速定级（可选），再按推荐路线挑战。答错不会扣能力——用提示定位盲区，再试一次就好。
              </p>
            </div>

            <div className="progress-panel">
              <div className="progress-block">
                <div className="progress-head">
                  <strong>等级进度</strong>
                  <span>
                    Lv.{levelProgress.level}
                    {levelProgress.nextLevelXp !== null
                      ? ` · 距 Lv.${levelProgress.level + 1} 还差 ${levelProgress.xpToNext} XP`
                      : ' · 已达当前最高等级段'}
                  </span>
                </div>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={levelProgress.progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${levelProgress.progressPercent}%` }}
                  />
                </div>
                <div className="progress-foot">
                  <span>{player.xp} XP</span>
                  <span>
                    {levelProgress.nextLevelXp !== null
                      ? `下一档 ${levelProgress.nextLevelXp} XP`
                      : '—'}
                  </span>
                </div>
              </div>

              <div className="progress-block">
                <div className="progress-head">
                  <strong>任务完成度</strong>
                  <span>
                    {clearedCount} / {questTotal} 通关 · {availableCount} 可挑战
                  </span>
                </div>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={clearPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="progress-bar-fill accent" style={{ width: `${clearPercent}%` }} />
                </div>
                <div className="progress-foot">
                  <span>{clearPercent}% 已通关</span>
                  <span>Async World</span>
                </div>
              </div>
            </div>

            {dueNodes.length > 0 && (
              <div className="banner review">
                <strong>有 {dueNodes.length} 个知识点适合复习了</strong>
                <span>不是进度倒退，只是记忆需要再加固：{dueNodes.join(', ')}</span>
                {nextQuest && (
                  <button className="submit-button" onClick={() => openQuest(nextQuest.id)}>
                    开始复习 · {nextQuest.title}
                  </button>
                )}
              </div>
            )}

            <div className="hub-actions">
              {!adaptive.calibration && (
                <button className="submit-button primary" onClick={startCalibration}>
                  开始定级（3 题）
                </button>
              )}
              {adaptive.calibration && (
                <div className="meta-chip">
                  定级：{adaptive.calibration.level}
                  {adaptive.calibration.recommendedQuestId
                    ? ` · 推荐起点 ${adaptive.calibration.recommendedQuestId}`
                    : ' · 已全部通过'}
                </div>
              )}
              {nextQuest ? (
                <button className="submit-button primary" onClick={() => openQuest(nextQuest.id)}>
                  下一题 · {nextQuest.title}
                </button>
              ) : (
                <div className="meta-chip">当前没有可推荐的下一题（可能已全部通关）</div>
              )}
            </div>

            {masteryEntries.length > 0 && (
              <div className="mastery-row">
                <h3>能力掌握</h3>
                <div className="mastery-grid">
                  {masteryEntries.map((item) => (
                    <div className="mastery-card" key={item.skillDimension}>
                      <span>{skillLabel(item.skillDimension)}</span>
                      <strong>{Math.round(item.score)}</strong>
                      <div className="mini-bar">
                        <div
                          className="mini-bar-fill"
                          style={{ width: `${Math.min(100, Math.round(item.score))}%` }}
                        />
                      </div>
                      <small>{item.evidenceCount} 条证据</small>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="quest-list">
              <h3>任务列表</h3>
              {quests.map((quest) => {
                const p = progress[quest.id];
                const status = p?.status ?? 'locked';
                return (
                  <div className={`quest-card status-${status}`} key={quest.id}>
                    <div className="quest-info">
                      <h3>{quest.title}</h3>
                      <p>
                        难度 {quest.difficulty} · {statusLabel(status)}
                        {quest.knowledgeNodeIds?.length
                          ? ` · ${quest.knowledgeNodeIds.join('/')}`
                          : ''}
                      </p>
                    </div>
                    <button
                      disabled={status === 'locked'}
                      onClick={() => openQuest(quest.id)}
                    >
                      {status === 'cleared' ? '复习' : status === 'available' ? '挑战' : '锁定'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {screen === 'calibrate' && (
          <section className="challenge-card">
            {!calibDone && calibrationQuests[calibIndex] && (
              <>
                <div className="meta-chip">
                  定级 {calibIndex + 1} / {calibrationQuests.length} · 用来找到合适起点，不是考试
                </div>
                <h2>{calibrationQuests[calibIndex]!.title}</h2>
                <ChallengeContent
                  challenge={calibrationQuests[calibIndex]!.challenge}
                  selectedAnswer={calibSelected}
                  onSelect={setCalibSelected}
                />
                <div className="action-bar">
                  <button
                    className="submit-button"
                    disabled={!calibSelected}
                    onClick={submitCalibrationStep}
                  >
                    {calibIndex + 1 >= calibrationQuests.length ? '完成定级' : '下一题'}
                  </button>
                  <button className="hint-button" onClick={() => setScreen('hub')}>
                    跳过定级
                  </button>
                </div>
              </>
            )}
            {calibDone && adaptive.calibration && (
              <div className="result success">
                <div className="result-icon">🧭</div>
                <h2>定级完成：{adaptive.calibration.level}</h2>
                <p className="result-lead">
                  {adaptive.calibration.recommendedQuestId
                    ? `我们会优先从「${adaptive.calibration.recommendedQuestId}」附近给你推荐挑战。`
                    : '定级题都过了，你可以按自己的节奏挑任务。'}
                </p>
                <p className="result-soft">定级不会发放 XP，也不会改写关卡解锁——只影响推荐路径。</p>
                <div className="action-bar">
                  <button
                    className="submit-button primary"
                    onClick={() => {
                      setScreen('hub');
                      if (nextQuest) openQuest(nextQuest.id);
                    }}
                  >
                    开始推荐挑战
                  </button>
                  <button className="hint-button" onClick={() => setScreen('hub')}>
                    返回大厅
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {screen === 'quest' && runtime && activeQuest && (
          <section className="challenge-card">
            <div className="meta-chip">
              {activeQuest.title} · 难度 {activeQuest.difficulty}
              {runtime.hintsUsed > 0 ? ` · 已用提示 ${runtime.hintsUsed}` : ''}
            </div>
            {!runtime.result && (
              <>
                <ChallengeContent
                  challenge={activeQuest.challenge}
                  selectedAnswer={runtime.selectedAnswer}
                  onSelect={selectAnswer}
                />
                {runtime.hintsUsed > 0 && activeQuest.hints?.[runtime.hintsUsed - 1] && (
                  <div className="banner hint">
                    <strong>提示 {runtime.hintsUsed}</strong>
                    <span>{activeQuest.hints[runtime.hintsUsed - 1]}</span>
                  </div>
                )}
                <div className="action-bar">
                  <button
                    className="submit-button"
                    disabled={!runtime.selectedAnswer}
                    onClick={submitAnswer}
                  >
                    提交答案
                  </button>
                  <button className="hint-button" onClick={useHint}>
                    需要提示
                  </button>
                  <button
                    className="hint-button"
                    onClick={() => {
                      exitQuest();
                      setScreen('hub');
                    }}
                  >
                    返回
                  </button>
                </div>
              </>
            )}
            {runtime.result && resultCopy && (
              <div className={`result ${runtime.result.passed ? 'success' : 'failure'}`}>
                <div className="result-icon">{runtime.result.passed ? '✅' : '💡'}</div>
                <h2>{resultCopy.title}</h2>
                <p className="result-lead">{resultCopy.lead}</p>
                <p className="result-detail">{resultCopy.detail}</p>
                <p className="result-soft">{resultCopy.encouragement}</p>
                <div className="result-meta">
                  <span>得分 {runtime.result.score}</span>
                  {runtime.result.passed && <span>当前 {player.xp} XP · Lv.{level}</span>}
                  {!runtime.result.passed && (
                    <span>尝试次数 {progress[activeQuest.id]?.attempts ?? 1}</span>
                  )}
                </div>
                <div className="action-bar">
                  {!runtime.result.passed && (
                    <button className="submit-button primary" onClick={retryQuest}>
                      再试一次
                    </button>
                  )}
                  {runtime.result.passed && nextQuest && nextQuest.id !== activeQuest.id && (
                    <button
                      className="submit-button primary"
                      onClick={() => openQuest(nextQuest.id)}
                    >
                      下一题 · {nextQuest.title}
                    </button>
                  )}
                  {runtime.result.passed && (!nextQuest || nextQuest.id === activeQuest.id) && (
                    <button
                      className="submit-button primary"
                      onClick={() => {
                        exitQuest();
                        setScreen('hub');
                      }}
                    >
                      返回大厅看看进度
                    </button>
                  )}
                  <button
                    className="hint-button"
                    onClick={() => {
                      exitQuest();
                      setScreen('hub');
                    }}
                  >
                    返回大厅
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
