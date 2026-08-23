import { useGameStore, getQuest } from './application/gameStoreV2';
import { calculateLevel } from './domain/player/level';
import { asyncBoss } from './content/bosses/asyncBoss';
import type { Challenge } from './domain/quest/types';
import { FeedbackContainer } from './presentation/components/feedback/FeedbackContainer';
import './styles.css';

function ChallengeContent({ challenge, selectedAnswer, onSelect }: { challenge: Challenge; selectedAnswer: string | null; onSelect: (answer: string) => void }) {
  if (challenge.type === 'code') {
    return <div className="result failure"><div className="result-icon">🛠️</div><span>CODE CHALLENGE</span><h2>代码题即将开放</h2></div>;
  }

  return <><h2 className="question-text">{challenge.question}</h2><div className="options">{challenge.options.map((option) => <button className={selectedAnswer === option.id ? 'selected' : ''} key={option.id} onClick={() => onSelect(option.id)}><span>{option.id}</span>{option.label}</button>)}</div></>;
}

export default function App() {
  const player = useGameStore((state) => state.player);
  const runtime = useGameStore((state) => state.runtime);
  const currentStreak = useGameStore((state) => state.currentStreak);
  const bestStreak = useGameStore((state) => state.bestStreak);
  const startQuest = useGameStore((state) => state.startQuest);
  const startBoss = useGameStore((state) => state.startBoss);
  const startBossPhase = useGameStore((state) => state.startBossPhase);
  const selectAnswer = useGameStore((state) => state.selectAnswer);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const exitQuest = useGameStore((state) => state.exitQuest);
  const retryQuest = useGameStore((state) => state.retryQuest);
  const useHint = useGameStore((state) => state.useHint);
  const activeQuest = runtime ? getQuest(runtime.questId) : undefined;
  const level = calculateLevel(player.xp);

  return <>
    <FeedbackContainer />
    <main className="app-shell">
      <header className="topbar"><div><span className="eyebrow">FRONTEND QUEST</span><h1>前端冒险者公会</h1></div><div className="player-stats"><div className="player-card"><span>Lv.{level}</span><strong>{player.xp} XP</strong></div><div className="streak-card"><span>🔥 连胜</span><strong>{currentStreak}</strong><small>最高 {bestStreak}</small></div></div></header>
      {!runtime && <section className="chapter-card"><div className="quest-list">{asyncBoss.phases.flatMap((phase) => phase.questIds).map((questId)=><div className="quest-card" key={questId}><div className="quest-info"><h3>{questId}</h3></div><button onClick={()=>startQuest(questId)}>开始挑战</button></div>)}<button className="submit-button" onClick={startBoss}>进入 Boss 战</button></div></section>}
      {runtime && activeQuest && <section className="challenge-card"><ChallengeContent challenge={activeQuest.challenge} selectedAnswer={runtime.selectedAnswer} onSelect={selectAnswer}/><div className="action-bar"><button className="submit-button" onClick={submitAnswer}>提交答案</button><button className="submit-button" onClick={runtime.result?.passed ? exitQuest : retryQuest}>继续</button><button className="hint-button" onClick={useHint}>提示</button><button className="submit-button" onClick={startBossPhase}>Boss阶段</button></div></section>}
    </main>
  </>;
}
