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
import { TimelinePrototype } from './prototype/timeline/TimelinePrototype';
import './styles.css';

type Screen = 'hub' | 'calibrate' | 'quest' | 'prototype';

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
  const now = useMemo(
    () => new Date().toISOString(),
    [runtime?.result, adaptive.review, adaptive.lastActiveAt],
  );
  const hubBanner = buildHubStatusBanner({
    lastActiveAt: adaptive.lastActiveAt,
    review: adaptive.review,
    now,
  });

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

  function goHub() {
    exitQuest();
    setScreen('hub');
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
            <p className="volume-line">{UI.volumeTitle}</p>
          </div>
          {screen !== 'prototype' && (
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
          )}
        </header>

        {screen === 'hub' && (
          <section className="chapter-card hub">
            <div className="anomaly-card">
              <span className="anomaly-eyebrow">原型 · 独立体验</span>
              <h2>时序初章</h2>
              <p className="anomaly-body">
                粮仓、东门、库房——三处现场连续发生。不记分、不入档，只验证「修复现场」是否比刷题更想往下走。
              </p>
              <div className="hub-actions anomaly-actions">
                <button
                  className="submit-button primary"
                  onClick={() => setScreen('prototype')}
                >
                  进入今日救火
                </button>
              </div>
            </div>

            {hubBanner && (
              <div className={`banner ${hubBanner.tone === 'return' ? 'return' : 'review'}`}>
                <strong>{hubBanner.title}</strong>
                <span>{hubBanner.body}</span>
              </div>
            )}

            <div className="progress-panel compact">
              <div className="progress-block">
                <div className="progress-head">
                  <strong>学徒等级</strong>
                  <span>
                    Lv.{levelProgress.level}
                    {levelProgress.nextLevelXp !== null
                      ? ` · 距下一档 ${levelProgress.xpToNext} XP`
                      : ' · 已达当前段'}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${levelProgress.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {!adaptive.calibration && (
              <div className="hub-actions secondary-actions">
                <button className="hint-button" onClick={startCalibration}>
                  {UI.ctaCalibrate}
                </button>
              </div>
            )}

            {masteryEntries.length > 0 && (
              <div className="mastery-row">
                <h3>已铭刻法则</h3>
                <div className="mastery-grid">
                  {masteryEntries.map((item) => (
                    <div className="mastery-card" key={item.skillDimension}>
                      <span>{skillLabel(item.skillDimension)}</span>
                      <strong>{Math.round(item.score)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {screen === 'prototype' && (
          <TimelinePrototype onExit={() => setScreen('hub')} />
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
                <h2>{UI.calibrateDoneTitle(adaptive.calibration.level)}</h2>
                <div className="action-bar">
                  <button className="submit-button primary" onClick={() => setScreen('hub')}>
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
            </div>
            {!runtime.result && (
              <>
                <ChallengeContent
                  challenge={activeQuest.challenge}
                  selectedAnswer={runtime.selectedAnswer}
                  onSelect={selectAnswer}
                />
                <div className="action-bar">
                  <button
                    className="submit-button"
                    disabled={!runtime.selectedAnswer}
                    onClick={submitAnswer}
                  >
                    提交
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
                <h2>{resultCopy.title}</h2>
                <p className="result-lead">{resultCopy.lead}</p>
                <div className="action-bar">
                  {!runtime.result.passed && (
                    <button className="submit-button primary" onClick={retryQuest}>
                      {UI.ctaRetry}
                    </button>
                  )}
                  {runtime.result.passed && nextQuest && (
                    <button
                      className="submit-button primary"
                      onClick={() => openQuest(nextQuest.id)}
                    >
                      {UI.ctaNextQuest}
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
      </main>
    </>
  );
}
