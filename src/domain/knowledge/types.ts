export interface World {
  id: string;
  title: string;
  description: string;
}

export interface KnowledgeNode {
  id: string;
  worldId: string;
  title: string;
  description: string;
  prerequisiteIds: string[];
}
