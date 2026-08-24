export interface KnowledgeNode {
  id: string;
  title: string;
  prerequisiteNodeIds: string[];
}

export interface KnowledgeGraph {
  nodes: Record<string, KnowledgeNode>;
}

export function getUnlockedNodes(graph: KnowledgeGraph, masteredNodeIds: string[]): KnowledgeNode[] {
  const mastered = new Set(masteredNodeIds);
  return Object.values(graph.nodes).filter((node) =>
    !mastered.has(node.id) && node.prerequisiteNodeIds.every((id) => mastered.has(id)),
  );
}
