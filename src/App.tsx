import { useGameStore, getQuest } from './application/gameStore';
import { calculateLevel } from './domain/player/level';
import type { Challenge } from './domain/quest/types';
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
  const runtime = useGameStore((state) => state.runtime);
  const startQuest = useGameStore((state) => state.startQuest);
  const selectAnswer = useGameStore((state) => state.selectAnswer);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const retryQuest = useGameStore((state) => state.retryQuest);
  const exitQuest = useGameStore((state) => state.exitQuest);

  const activeQuest = runtime ? getQuest(runtime.questId) : undefined;
  const level = calculateLevel(player.xp);

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
            {['promise-basics', 'promise-chain'].map((questId, index) => {
              const quest = getQuest(questId)!;
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
        </section>
      ) : activeQuest ? (
        <section className="challenge-card">
          <div className="challenge-header">
            <button className="back-button" onClick={exitQuest}>← 返回关卡地图</button>
            <span>+{activeQuest.reward.xp} XP</span>
          </div>

          {!runtime.result ? (
            <>
              <span className="chapter-label">QUEST · {activeQuest.title}</span>
              <ChallengeContent
                challenge={activeQuest.challenge}
                selectedAnswer={runtime.selectedAnswer}
                onSelect={selectAnswer}
              />
              {activeQuest.challenge.type !== 'code' && (
                <button className="submit-button" disabled={!runtime.selectedAnswer} onClick={submitAnswer}>
                  提交答案
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
              {runtime.result.passed && (
                <p className="reward-note">
                  {currentStreak > 1 ? `🔥 ${currentStreak} 连胜，获得额外 XP 奖励！` : '获得首通 XP 奖励！'}
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
