import { useMemo, useState } from 'react';
import { useGameStore, getQuest } from './application/gameStoreV2';
import { getLevelProgress } from './domain/player/level';
import type { Challenge } from './domain/quest/types';
import type { CalibrationAnswer } from './domain/calibration/types';
import { quests } from './content/quests';
import { asyncWorldCalibration } from './content/calibration/asyncWorld';
import { selectNextQuest } from './application/useCases/getNextQuest';
import { evaluateChallenge } from './domain/quest/evaluator';
import { buildResultCopy } from './presentation/experience/resultCopy';
import { skillLabel } from './presentation/experience/skillLabels';
import { UI } from './presentation/experience/uiCopy';
import { buildHubStatusBanner } from './presentation/experience/returnCopy';
import { FeedbackContainer } from './presentation/components/feedback/FeedbackContainer';
import { AdventureLab } from './presentation/components/adventure/AdventureLab';
import { chapter1 } from './content/adventures/chapter1';
import './styles.css';

type Screen = 'hub' | 'calibrate' | 'quest' | 'adventure';

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
  if (status === 'cleared') return UI.statusCleared;
  if (status === 'available') return UI.statusAvailable;
  return UI.statusLocked;
}

function lockReason(
  quest: { prerequisiteQuestIds: string[] },
  progress: Record<string, { status?: string } | undefined>,
): string {
  const missing = quest.prerequisiteQuestIds.filter((id) => progress[id]?.status !== 'cleared');
  if (missing.length === 0) return '暂未解锁';
  const titles = missing.map((id) => getQuest(id)?.title ?? id);
  return `需先完成：${titles.join('、')}`;
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
  const now = useMemo(() => new Date().toISOString(), [runtime?.result, adaptive.review, adaptive.lastActiveAt]);
  const hubBanner = buildHubStatusBanner({
    lastActiveAt: adaptive.lastActiveAt,
    review: adaptive.review,
    now,
  });

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

  const isNewPlayer = clearedCount === 0 && !adaptive.calibration;

  function openQuest(questId: string) {
    startQuest(questId);
    setScreen('quest');
  }

  function goHub() {
    exitQuest();
    setScreen('hub');
  }

  function openAdventure() {
    setScreen('adventure');
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
            <span className="eyebrow">{UI.productEyebrow}</span>
            <h1>{UI.worldTitle}</h1>
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
            <div className={`banner onboarding ${isNewPlayer ? 'emphasize' : ''}`}>
              <h2>{UI.onboardingTitle}</h2>
              <ol className="steps">
                {UI.onboardingSteps.map((step) => (
                  <li key={step.n}>
                    <span className="step-n">{step.n}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Sprint 5 temporary entry — Step 3 will replace with proper city hub */}
            <div className="banner review">
              <strong>当前异象：{chapter1.title}</strong>
              <span>时序链中断，台账与库存不再跟随支付契约。</span>
              <button className="submit-button primary" onClick={openAdventure}>
                进入金库现场
              </button>
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
                    {clearedCount} / {questTotal} 通关 · {availableCount} {UI.statusAvailable}
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
                  <span>{UI.worldTitle}</span>
                </div>
              </div>
            </div>

            {hubBanner && (
              <div className={`banner ${hubBanner.tone === 'return' ? 'return' : 'review'}`}>
                <strong>{hubBanner.title}</strong>
                <span>{hubBanner.body}</span>
                {nextQuest && (
                  <button className="submit-button" onClick={() => openQuest(nextQuest.id)}>
                    {hubBanner.tone === 'review' || hubBanner.body.includes('复习')
                      ? `${UI.ctaReview} · ${nextQuest.title}`
                      : `${UI.ctaNextQuest} · ${nextQuest.title}`}
                  </button>
                )}
              </div>
            )}

            <div className="hub-actions">
              {!adaptive.calibration && (
                <>
                  <button className="submit-button primary" onClick={startCalibration}>
                    {UI.ctaCalibrate}
                  </button>
                  {nextQuest && (
                    <button className="hint-button" onClick={() => openQuest(nextQuest.id)}>
                      {UI.ctaSkipCalibrate}
                    </button>
                  )}
                </>
              )}
              {adaptive.calibration && (
                <div className="meta-chip">
                  定级：{adaptive.calibration.level}
                  {adaptive.calibration.recommendedQuestId
                    ? ` · 推荐 ${adaptive.calibration.recommendedQuestId}`
                    : ' · 定级题已全部通过'}
                </div>
              )}
              {nextQuest ? (
                <button className="submit-button primary" onClick={() => openQuest(nextQuest.id)}>
                  {UI.ctaNextQuest} · {nextQuest.title}
                </button>
              ) : (
                <div className="meta-chip">{UI.noNextQuest}</div>
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
                      {status === 'locked' && (
                        <p className="lock-hint">{lockReason(quest, progress)}</p>
                      )}
                    </div>
                    <button
                      disabled={status === 'locked'}
                      onClick={() => openQuest(quest.id)}
                    >
                      {status === 'cleared'
                        ? UI.ctaReplay
                        : status === 'available'
                          ? UI.ctaChallenge
                          : UI.ctaLocked}
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
                  {UI.calibrateChip(calibIndex + 1, calibrationQuests.length)}
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
                    {calibIndex + 1 >= calibrationQuests.length
                      ? UI.ctaFinishCalibrate
                      : UI.ctaCalibrateNext}
                  </button>
                  <button className="hint-button" onClick={() => setScreen('hub')}>
                    {UI.ctaSkipCalibrate}
                  </button>
                </div>
              </>
            )}
            {calibDone && adaptive.calibration && (
              <div className="result success">
                <div className="result-icon">🧭</div>
                <h2>{UI.calibrateDoneTitle(adaptive.calibration.level)}</h2>
                <p className="result-lead">
                  {adaptive.calibration.recommendedQuestId
                    ? `推荐从「${adaptive.calibration.recommendedQuestId}」附近开始。`
                    : '定级题都过了，可以按自己的节奏选任务。'}
                </p>
                <p className="result-soft">{UI.calibrateNoXpNote}</p>
                <div className="action-bar">
                  <button
                    className="submit-button primary"
                    onClick={() => {
                      setScreen('hub');
                      if (nextQuest) openQuest(nextQuest.id);
                    }}
                  >
                    {UI.ctaStartRecommended}
                  </button>
                  <button className="hint-button" onClick={() => setScreen('hub')}>
                    {UI.ctaBackHub}
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
                    {UI.ctaHint}
                  </button>
                  <button className="hint-button" onClick={goHub}>
                    {UI.ctaBackHub}
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
                      {UI.ctaRetry}
                    </button>
                  )}
                  {runtime.result.passed && nextQuest && nextQuest.id !== activeQuest.id && (
                    <button
                      className="submit-button primary"
                      onClick={() => openQuest(nextQuest.id)}
                    >
                      {UI.ctaNextQuest} · {nextQuest.title}
                    </button>
                  )}
                  {runtime.result.passed && (!nextQuest || nextQuest.id === activeQuest.id) && (
                    <button className="submit-button primary" onClick={goHub}>
                      {UI.allClearHub}
                    </button>
                  )}
                  <button className="hint-button" onClick={goHub}>
                    {UI.ctaBackHub}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {screen === 'adventure' && (
          <AdventureLab
            chapter={chapter1}
            onBack={() => setScreen('hub')}
          />
        )}
      </main>
    </>
  );
}
