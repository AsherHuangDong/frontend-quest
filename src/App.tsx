import { useGameStore, getQuest } from './application/gameStore';
import { calculateLevel } from './domain/player/level';
import './styles.css';

export default function App() {
  const player = useGameStore((state) => state.player);
  const progress = useGameStore((state) => state.progress);
  const runtime = useGameStore((state) => state.runtime);
  const startQuest = useGameStore((state) => state.startQuest);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const retryQuest = useGameStore((state) => state.retryQuest);

  const activeQuest = runtime ? getQuest(runtime.questId) : undefined;
  const level = calculateLevel(player.xp);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">FRONTEND QUEST</span>
          <h1>前端冒险者公会</h1>
        </div>
        <div className="player-card">
          <span>Lv.{level}</span>
          <strong>{player.xp} XP</strong>
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
                  </div>
                  <button
                    disabled={locked}
                    onClick={() => startQuest(quest.id)}
                  >
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
            <span>QUEST · {activeQuest.title}</span>
            <span>+{activeQuest.reward.xp} XP</span>
          </div>

          {!runtime.result ? (
            <>
              <h2>{activeQuest.challenge.question}</h2>
              <div className="options">
                {activeQuest.challenge.options.map((option) => (
                  <button
                    className={runtime.selectedAnswer === option.id ? 'selected' : ''}
                    key={option.id}
                    onClick={() => useGameStore.setState((state) => ({
                      runtime: state.runtime
                        ? { ...state.runtime, selectedAnswer: option.id }
                        : null,
                    }))}
                  >
                    <span>{option.id}</span>
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                className="submit-button"
                disabled={!runtime.selectedAnswer}
                onClick={() => submitAnswer(runtime.selectedAnswer!)}
              >
                提交答案
              </button>
            </>
          ) : (
            <div className={`result ${runtime.result.passed ? 'success' : 'failure'}`}>
              <div className="result-icon">{runtime.result.passed ? '⚔️' : '💀'}</div>
              <span>{runtime.result.passed ? 'QUEST CLEARED' : 'QUEST FAILED'}</span>
              <h2>{runtime.result.passed ? '挑战成功！' : '再想想。'}</h2>
              <strong>{runtime.result.score} 分</strong>
              <p>{runtime.result.feedback}</p>
              <button className="submit-button" onClick={retryQuest}>
                {runtime.result.passed ? '再次挑战' : '重新挑战'}
              </button>
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
