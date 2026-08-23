import { useGameStore, getQuest } from './application/gameStoreV2';
import { calculateLevel } from './domain/player/level';
import { getPhaseStatus } from './domain/boss/stateMachine';
import { asyncBoss } from './content/bosses/asyncBoss';
import type { Challenge } from './domain/quest/types';
import { getHintPenalty } from './domain/quest/scoring';
import './styles.css';

function ChallengeContent({
  challenge,
  selectedAnswer,
  onSelect,
}: {
  challenge: Challenge;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
}) {
  if (challenge.type === 'code') {
    return (
      <div className="result failure">
        <div className="result-icon">🛠️</div>
        <span>CODE CHALLENGE</span>
        <h2>代码题即将开放</h2>
        <p>当前已经预留 CodeEvaluator，后续会接入 Sandbox 和测试用例自动判题。</p>
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
  const currentStreak = useGameStore((state) => state.currentStreak);
  const bestStreak = useGameStore((state) => state.bestStreak);
  const bossProgress = useGameStore((state) => state.bossProgress);
  const runtime = useGameStore((state) => state.runtime);
  const startQuest = useGameStore((state) => state.startQuest);
  const startBossPhase = useGameStore((state) => state.startBossPhase);
  const startBoss = useGameStore((state) => state.startBoss);
  const selectAnswer = useGameStore((state) => state.selectAnswer);
  const useHint = useGameStore((state) => state.useHint);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const retryQuest = useGameStore((state) => state.retryQuest);
  const exitQuest = useGameStore((state) => state.exitQuest);

  const activeQuest = runtime ? getQuest(runtime.questId) : undefined;
  const level = calculateLevel(player.xp);
  const hints = activeQuest?.hints ?? [];
  const nextHintIndex = runtime?.hintsUsed ?? 0;
  const allChapterQuestsCleared = asyncBoss.phases.every((phase) =>
    phase.questIds.every((questId) => progress[questId]?.status === 'cleared'),
  );
  const currentBossPhase = asyncBoss.phases[bossProgress.currentPhaseIndex];

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">FRONTEND QUEST</span>
          <h1>前端冒险者公会</h1>
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

      {!runtime ? (
        <section className="chapter-card">
          <span className="chapter-label">CHAPTER 01</span>
          <h2>JavaScript 基础</h2>
          <p>从 Promise 开始，击败第一批知识小怪。</p>

          <div className="quest-list">
            {asyncBoss.phases.flatMap((phase) => phase.questIds).map((questId, index) => {
              const quest = getQuest(questId);
              if (!quest) return null;
              const questProgress = progress[questId];
              const locked = questProgress.status === 'locked';
              const cleared = questProgress.status === 'cleared';

              return (
                <article className={`quest-card ${locked ? 'locked' : ''}`} key={quest.id}>
                  <div className="quest-number">0{index + 1}</div>
                  <div className="quest-info">
                    <span>QUEST · 难度 {quest.difficulty}</span>
                    <h3>{quest.title}</h3>
                    <p>{quest.description}</p>
                    <div className="mastery-row">
                      <span>熟练度</span>
                      <div className="mastery-bar">
                        <div style={{ width: `${questProgress.bestScore}%` }} />
                      </div>
                      <strong>{questProgress.bestScore}%</strong>
                    </div>
                  </div>
                  <button disabled={locked} onClick={() => startQuest(quest.id)}>
                    {cleared ? '再次挑战' : locked ? '🔒 未解锁' : '开始挑战'}
                  </button>
                </article>
              );
            })}
          </div>

          {allChapterQuestsCleared && (
            <section className="boss-panel">
              <span className="chapter-label">BOSS · FINAL TRIAL</span>
              <h2>👹 {asyncBoss.title}</h2>
              <p>{asyncBoss.description}</p>
              <p>通关奖励：+{asyncBoss.rewardXp} XP</p>

              <ol>
                {asyncBoss.phases.map((phase, index) => {
                  const status = getPhaseStatus(asyncBoss, bossProgress, index);
                  const score = bossProgress.phaseScores[phase.id];
                  return (
                    <li key={phase.id}>
                      <strong>{phase.title}</strong>{' '}
                      {status === 'CLEARED' && `✓ ${score} 分`}
                      {status === 'ACTIVE' && '⚔️ 当前阶段'}
                      {status === 'LOCKED' && '🔒'}
                    </li>
                  );
                })}
              </ol>

              {bossProgress.status === 'AVAILABLE' && (
                <button className="submit-button" onClick={startBoss}>进入 Boss 战</button>
              )}
              {bossProgress.status === 'IN_PROGRESS' && currentBossPhase && (
                <button className="submit-button" onClick={startBossPhase}>
                  挑战 {currentBossPhase.title}
                </button>
              )}
              {bossProgress.status === 'CLEARED' && <p className="reward-note">🏆 异步之王已击败！</p>}
            </section>
          )}
        </section>
      ) : activeQuest ? (
        <section className="challenge-card">
          <div className="challenge-header">
            <button className="back-button" onClick={exitQuest}>← 返回关卡地图</button>
            <span>{runtime.bossPhaseId ? `👹 ${asyncBoss.title}` : `+${activeQuest.reward.xp} XP`}</span>
          </div>

          {!runtime.result ? (
            <>
              {runtime.bossPhaseId && (
                <div className="boss-phase-banner">
                  <strong>{currentBossPhase?.title}</strong>
                  <span>需要 ≥ {currentBossPhase?.requiredScore} 分</span>
                </div>
              )}
              <span className="chapter-label">QUEST · {activeQuest.title}</span>
              <ChallengeContent
                challenge={activeQuest.challenge}
                selectedAnswer={runtime.selectedAnswer}
                onSelect={selectAnswer}
              />

              {hints.length > 0 && (
                <div className="hint-panel">
                  <div className="hint-header">
                    <span>💡 提示</span>
                    <small>{runtime.hintsUsed}/{hints.length} · 每次提示 -{getHintPenalty(nextHintIndex)} 分</small>
                  </div>
                  {runtime.hintsUsed > 0 && (
                    <div className="hint-content">
                      {hints.slice(0, runtime.hintsUsed).map((hint, index) => (
                        <p key={hint}><strong>提示 {index + 1}：</strong>{hint}</p>
                      ))}
                    </div>
                  )}
                  <button
                    className="hint-button"
                    disabled={runtime.hintsUsed >= hints.length}
                    onClick={useHint}
                  >
                    {runtime.hintsUsed >= hints.length ? '没有更多提示' : `使用提示 ${runtime.hintsUsed + 1}`}
                  </button>
                </div>
              )}

              {activeQuest.challenge.type !== 'code' && (
                <button className="submit-button" disabled={!runtime.selectedAnswer} onClick={submitAnswer}>
                  {runtime.bossPhaseId ? '提交 Boss 挑战' : '提交答案'}
                </button>
              )}
            </>
          ) : (
            <div className={`result ${runtime.result.passed ? 'success' : 'failure'}`}>
              <div className="result-icon">{runtime.result.passed ? '⚔️' : '💀'}</div>
              <span>{runtime.result.passed ? 'QUEST CLEARED' : 'QUEST FAILED'}</span>
              <h2>{runtime.result.passed ? '挑战成功！' : '再想想。'}</h2>
              <strong>{runtime.result.score} 分</strong>
              <p>{runtime.result.feedback}</p>
              {runtime.bossPhaseId && !runtime.result.passed && currentBossPhase && (
                <p className="reward-note">Boss 阶段需要至少 {currentBossPhase.requiredScore} 分，当前阶段不会推进。</p>
              )}
              {runtime.bossPhaseId && runtime.result.passed && bossProgress.status === 'CLEARED' && (
                <p className="reward-note">🏆 击败异步之王！获得 +{asyncBoss.rewardXp} XP。</p>
              )}
              {!runtime.bossPhaseId && runtime.result.passed && (
                <p className="reward-note">
                  {runtime.hintsUsed > 0
                    ? `使用了 ${runtime.hintsUsed} 次提示，熟练度最高为 ${runtime.result.score}%。`
                    : currentStreak > 1
                      ? `🔥 ${currentStreak} 连胜，获得额外 XP 奖励！`
                      : '获得首通 XP 奖励！'}
                </p>
              )}
              <button className="submit-button" onClick={runtime.result.passed ? exitQuest : retryQuest}>
                {runtime.result.passed ? '返回关卡地图' : '重新挑战'}
              </button>
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
