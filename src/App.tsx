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
import { GranaryScene } from './presentation/components/story/GranaryScene';
import { granaryIncident } from './content/story/granaryIncident';
import { RelationalLab } from './prototype/relational/RelationalLab';
import './styles.css';
import './styles-story.css';

type Screen = 'hub' | 'calibrate' | 'quest' | 'story' | 'relational';

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
  const [granaryCleared, setGranaryCleared] = useState(false);
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
      { questId: quest.id, score: evaluation.score, passed: evaluation.passed },
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
            <span className="eyebrow">FRONTEND QUEST · 时序城</span>
            <h1>时序城</h1>
            <p className="volume-line">第一起事故</p>
          </div>
          {screen !== 'story' && screen !== 'relational' && (
            <div className="player-stats">
              <div className="player-card">
                <span>Lv.{level}</span>
                <strong>{player.xp} XP</strong>
              </div>
              <div className="streak-card">
                <span>🔥</span>
                <strong>{currentStreak}</strong>
                <small>最高 {bestStreak}</small>
              </div>
            </div>
          )}
        </header>

        {screen === 'hub' && (
          <section className="chapter-card hub">
            <p className="identity-line">
              你是时序城的修复者。城里的设施按某些规律运行——现在，规律出了问题。
            </p>

            <div className="city-status">
              <h3>城市状态</h3>
              <div className="city-row">
                <span>粮仓</span>
                <span className={granaryCleared ? 'ok' : 'bad'}>
                  {granaryCleared ? '🟢 已恢复' : '🔴 异常'}
                </span>
              </div>
              <div className="city-row">
                <span>驿站</span>
                <span className={granaryCleared ? 'bad' : 'muted'}>
                  {granaryCleared ? '🔴 异常光兆' : '🔒 尚未波及'}
                </span>
              </div>
              <div className="city-row">
                <span>城门</span>
                <span className="muted">🔒</span>
              </div>
            </div>

            {!granaryCleared ? (
              <div className="anomaly-card">
                <span className="anomaly-eyebrow">当前事故</span>
                <h2>{granaryIncident.title}</h2>
                <p className="anomaly-body">{granaryIncident.briefing}</p>
                <div className="hub-actions anomaly-actions">
                  <button
                    className="submit-button primary"
                    onClick={() => setScreen('story')}
                  >
                    前往粮仓
                  </button>
                </div>
              </div>
            ) : (
              <div className="anomaly-card cleared">
                <span className="anomaly-eyebrow">粮仓已稳</span>
                <h2>驿站似乎也不对</h2>
                <p className="anomaly-body">
                  远处警报刚刚亮起。下一处尚未开放（原型只做第一起）。
                </p>
                <div className="hub-actions anomaly-actions">
                  <button className="hint-button" onClick={() => setScreen('story')}>
                    再回粮仓看看
                  </button>
                </div>
              </div>
            )}

            {hubBanner && (
              <div className={`banner ${hubBanner.tone === 'return' ? 'return' : 'review'}`}>
                <strong>{hubBanner.title}</strong>
                <span>{hubBanner.body}</span>
              </div>
            )}

            <div className="progress-panel compact">
              <div className="progress-block">
                <div className="progress-head">
                  <strong>修复者等级</strong>
                  <span>Lv.{levelProgress.level}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${levelProgress.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="hub-actions secondary-actions">
              <button className="hint-button" onClick={() => setScreen('relational')}>
                Relational 原型（完成/就绪关系）
              </button>
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
                <h3>能力迹象</h3>
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

        {screen === 'story' && (
          <GranaryScene
            onExit={() => setScreen('hub')}
            onComplete={() => setGranaryCleared(true)}
          />
        )}

        {screen === 'relational' && (
          <RelationalLab onExit={() => setScreen('hub')} />
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
            {calibDone && (
              <div className="result success">
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
            <div className="meta-chip">{activeQuest.title}</div>
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
