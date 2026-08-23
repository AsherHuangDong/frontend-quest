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

export type Challenge = ChoiceChallenge;

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
}

export interface EvaluationResult {
  passed: boolean;
  score: number;
  feedback: string;
}
