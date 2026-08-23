export type QuestCompletedEvent = {
  type: 'QUEST_COMPLETED';
  questId: string;
  questName: string;
  rewards: {
    xp: number;
    skill?: string;
  };
};

export type XpGainedEvent = {
  type: 'XP_GAINED';
  amount: number;
  source: string;
};

export type QuestEvent = QuestCompletedEvent | XpGainedEvent;

export function createQuestCompletedEvent(
  questId: string,
  questName: string,
  xp: number,
  skill?: string,
): QuestCompletedEvent {
  return {
    type: 'QUEST_COMPLETED',
    questId,
    questName,
    rewards: {
      xp,
      skill,
    },
  };
}
