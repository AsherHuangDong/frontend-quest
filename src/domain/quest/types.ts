export type QuestStatus = 'locked' | 'available' | 'cleared';

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface ChoiceChallenge {
  type: 'choice';
  question: string;
  options: ChoiceOption[];
  correctAnswer: string;
}

export interface OutputChallenge {
  type: 'output';
  question: string;
  options: ChoiceOption[];
  correctAnswer: string;
}

export interface CodeChallenge {
  type: 'code';
  question: string;
  starterCode: string;
  language: 'javascript' | 'typescript';
}

export type Challenge = ChoiceChallenge | OutputChallenge | CodeChallenge;

export interface Reward {
  xp: number;
}

export interface Quest {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  challenge: Challenge;
  reward: Reward;
  prerequisiteQuestIds: string[];
  hints?: string[];
}

export interface EvaluationResult {
  passed: boolean;
  score: number;
  feedback: string;
}

export interface ChallengeEvaluator<TChallenge extends Challenge = Challenge> {
  evaluate(challenge: TChallenge, answer: string): EvaluationResult;
}
