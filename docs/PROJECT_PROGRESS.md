# Frontend Quest — Project Progress

> 这是跨对话恢复项目上下文的**进度状态文件**。
> 每完成一个明确功能 / Sprint 步骤，必须同步更新本文件。
> 产品长期目标与架构原则见 `docs/PROJECT_SPEC.md`。

---

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 1 — Learning Core
- **当前阶段:** Step 1 完成：仓库盘点 + Learning Core 第一版数据模型设计
- **AI:** 暂不接入
- **下一步:** Step 2 — 实现 Knowledge Model / Quest Content Schema
- **最后更新:** 2026-08-23

---

## 已完成

### 基础游戏闭环

```text
Chapter → Quest → Answer → Evaluation → Pass/Fail → XP → Unlock → LocalStorage
```

已存在：

- Quest / Chapter 基础流程
- Quest Evaluation / Pass / Fail
- XP / Level
- Quest Unlock / Progress
- Boss 与 Boss Phase
- Hint / Retry
- Streak
- LocalStorage 持久化
- MSW Mock API / Request 基础设施

### 产品规格

- `docs/PROJECT_SPEC.md` 已建立
- GitHub Issue #6：Sprint 1 — Async World Learning Core

---

# Sprint 1 — Learning Core

## Step 1 — 仓库盘点 + 数据模型设计 ✅

### 当前代码结构盘点

```text
src/
├── domain/
│   ├── boss/
│   │   ├── stateMachine.ts
│   │   ├── stateMachine.test.ts
│   │   └── types.ts
│   ├── chapter/
│   │   ├── progression.ts
│   │   ├── progression.test.ts
│   │   └── types.ts
│   ├── player/
│   │   ├── level.ts
│   │   ├── streak.ts
│   │   ├── streak.test.ts
│   │   └── types.ts
│   ├── progress/
│   │   └── types.ts
│   └── quest/
│       ├── evaluator.ts
│       ├── evaluator.test.ts
│       ├── scoring.ts
│       ├── scoring.test.ts
│       ├── unlock.ts
│       └── types.ts
│
├── content/
│   ├── bosses/asyncBoss.ts
│   ├── chapters.ts
│   ├── chapters/javascript.ts
│   └── quests.ts
│
├── application/
│   ├── gameStore.ts
│   ├── gameStoreV2.ts
│   ├── progressMigration.ts
│   ├── progressMigration.test.ts
│   └── useCases/submitQuest.ts
│
├── features/
│   ├── boss/
│   └── chapter/
│
└── infrastructure/
    └── persistence/
        └── LocalStorage Repository
```

### 现状判断

当前 Domain 已经承担了游戏规则，但学习领域模型还没有独立出来。

当前 `Quest` 同时承担了：

- 内容定义
- Challenge 定义
- 答案 / Evaluation 所需信息
- 难度
- 前置关系
- XP Reward

当前 `Progress` 主要记录：

- Quest 状态
- attempts
- bestScore
- lastScore
- clearedAt

当前 `Player` 只有：

```ts
id
name
xp
```

因此当前系统可以回答：

> “这个 Quest 通关了吗？”

但还不能可靠回答：

> “玩家掌握了哪些知识？”
> “玩家在哪一种能力维度上薄弱？”
> “这个 Quest 究竟训练了什么能力？”
> “为什么系统下一步应该给玩家这个挑战？”

这正是 Sprint 1 要解决的问题。

---

## Step 1 数据模型设计结论

### 设计原则

1. **Content 与 Player Progress 分离**
2. **Knowledge 与 Quest 分离**
3. **Quest 是训练载体，不是知识本身**
4. **Mastery 属于 Player Progress，不属于 Content**
5. **Evaluation 产生 Evidence，Evidence 再影响 Mastery**
6. **Calibration 是一种特殊的 Assessment，不直接修改 Content**
7. **AI 暂时不参与 Truth Layer**
8. **优先扩展现有模型，不进行一次性大重构**

---

## 第一版目标模型

```text
World
 │
 ├── KnowledgeNode
 │      │
 │      └── prerequisite / relation
 │
 ├── QuestDefinition
 │      │
 │      ├── knowledgeNodeIds
 │      ├── skillDimensions
 │      ├── difficulty
 │      └── challenge
 │
 └── BossDefinition

Player
 │
 ├── PlayerGoal
 ├── QuestProgress
 ├── SkillMastery
 └── CalibrationResult
```

### 1. KnowledgeNode

表示“玩家需要掌握的知识 / 概念”，不包含具体题目。

核心字段：

```ts
interface KnowledgeNode {
  id: string;
  worldId: string;
  title: string;
  description: string;
  prerequisiteIds: string[];
}
```

Async World 第一版：

```text
async-world
├── promise
├── promise-state
├── microtask
├── event-loop
├── async-await
└── race-condition
```

关系：

```text
promise
 ├── promise-state
 └── microtask
       └── event-loop
             └── async-await

microtask + event-loop + async-await
                 └── race-condition
```

注意：关系先使用简单 prerequisite 表达，不在 MVP 引入复杂图数据库。

---

### 2. SkillDimension

表示“玩家如何使用知识”，而不是“知道什么”。

MVP 固定五个维度：

```ts
type SkillDimension =
  | 'recall'
  | 'understand'
  | 'apply'
  | 'debug'
  | 'transfer';
```

知识和能力维度是两个不同轴：

```text
Knowledge = 学什么
Skill      = 怎么证明会了
```

---

### 3. QuestDefinition

Quest 是训练载体。

第一版建议：

```ts
interface QuestDefinition {
  id: string;
  worldId: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  knowledgeNodeIds: string[];
  skillDimensions: SkillDimension[];
  prerequisiteQuestIds: string[];
  challenge: Challenge;
  hints?: string[];
  reward: Reward;
}
```

其中：

```ts
type QuestType =
  | 'concept'
  | 'recall'
  | 'output'
  | 'reasoning'
  | 'code'
  | 'debug'
  | 'scenario'
  | 'design'
  | 'boss';
```

MVP 不要求所有 QuestType 都实现；先复用现有 `choice / output / code` challenge。

---

### 4. Evidence

Evaluation 不直接修改 Mastery，而是先产生证据。

第一版：

```ts
interface SkillEvidence {
  questId: string;
  dimension: SkillDimension;
  score: number;
  passed: boolean;
  attempts: number;
  hintsUsed: number;
  createdAt: string;
}
```

流程：

```text
Player Answer
     ↓
Evaluator
     ↓
EvaluationResult
     ↓
SkillEvidence
     ↓
Mastery Update
```

这样未来可以增加 Code Judge / AI Judge，而不用修改 Mastery 模型。

---

### 5. SkillMastery

记录玩家在某个知识节点上的能力状态。

第一版：

```ts
interface SkillMastery {
  knowledgeNodeId: string;
  scores: Record<SkillDimension, number>;
  overall: number;
  lastAssessedAt: string | null;
}
```

示例：

```text
Promise

Recall       90
Understand   80
Apply        70
Debug        50
Transfer     30
Overall      64
```

注意：`overall` 是派生指标，不应成为唯一事实来源。

---

### 6. Calibration

Calibration 是进入一个 World 时对玩家能力进行快速探测的特殊挑战集合。

第一版：

```ts
interface CalibrationDefinition {
  id: string;
  worldId: string;
  questIds: string[];
}

interface CalibrationResult {
  calibrationId: string;
  scores: Record<SkillDimension, number>;
  recommendedLevel: 'beginner' | 'intermediate' | 'advanced';
  completedAt: string;
}
```

MVP 不做复杂统计模型，使用确定性规则：

```text
平均得分 < 60  → beginner
60 ~ 79        → intermediate
>= 80          → advanced
```

后续再根据真实用户数据调整。

---

### 7. PlayerGoal

玩家目标与知识内容分离。

```ts
type PlayerGoal =
  | 'learn'
  | 'reinforce'
  | 'interview'
  | 'challenge';
```

MVP 可以先作为 Player Profile 的简单字段，不参与复杂推荐。

---

## 数据边界

### Content

只读、版本化、可被多人共享：

```text
World
KnowledgeNode
QuestDefinition
BossDefinition
CalibrationDefinition
```

### Player Progress

玩家私有、可持久化：

```text
Player
PlayerGoal
QuestProgress
SkillMastery
SkillEvidence
CalibrationResult
```

### Runtime

只存在于当前会话：

```text
currentQuest
selectedAnswer
currentEvaluation
hintsUsed
bossPhase
```

Runtime 不写入 Content。

---

## 与当前模型的兼容策略

当前 `Quest` 已经被现有 UI、Store、Evaluation 和 Boss 使用，因此 Sprint 1 **不做一次性重命名 / 大迁移**。

采用渐进式扩展：

```text
现有 Quest
   ↓
增加 worldId
增加 knowledgeNodeIds
增加 skillDimensions
   ↓
逐步形成 QuestDefinition
```

同理：

```text
现有 QuestProgress
   ↓
保持原有通关状态
   ↓
新增 SkillMastery / SkillEvidence
```

这样不会破坏目前已经验证通过的 Quest / Boss 闭环。

---

# 当前 Sprint 1 的实现顺序

## Step 2 — Knowledge Model

实现：

- `KnowledgeNode`
- Async World Knowledge 数据
- prerequisite 关系
- World 基础定义

## Step 3 — Quest Content Schema

实现：

- Quest 与 KnowledgeNode 建立关联
- Quest 与 SkillDimension 建立关联
- QuestType
- 保持现有 Challenge / Evaluation 兼容

## Step 4 — Skill / Evidence / Mastery

实现：

- SkillEvidence
- SkillMastery
- Evaluation → Evidence
- Evidence → Mastery

## Step 5 — Calibration

实现：

- CalibrationDefinition
- CalibrationResult
- 确定性等级判断

## Step 6 — Async World 最小内容集

至少覆盖：

```text
Explore
Promise

Understand
Promise State / Microtask

Reason
Event Loop / async-await

Debug
Async Bug

Boss
综合挑战
```

## Step 7 — Integration

接入现有 Quest Flow，但不改变当前用户已经验证通过的：

```text
Quest → Evaluation → Pass/Fail → XP → Unlock
Boss → Phase → Clear
```

## Step 8 — Tests

覆盖：

- Knowledge prerequisite
- Quest / Knowledge association
- Skill Evidence
- Mastery update
- Calibration
- 旧 Quest Flow 回归

---

# 当前不做

- AI Judge
- AI 出题
- 复杂推荐算法
- ML / Bayesian Mastery Model
- 图数据库
- 完整 Memory Algorithm
- 复杂 Difficulty Engine
- 重新设计整个 Store
- 删除现有 Quest / Boss 模型

---

# 下一步开发任务

> **Step 2：实现 Knowledge Model。**

开始写代码前必须先确认：

1. 当前代码是否存在与上述模型冲突的隐含约束
2. `world` 是否应该作为独立 Domain Entity，还是 MVP 只作为 Content Metadata
3. `KnowledgeNode` 的 prerequisite 是否足够表达 Async World
4. `SkillDimension` 是否应该放在 `domain/skill` 而不是 `domain/quest`

确认后再实现代码。

---

## 跨对话恢复规则

新的对话必须先阅读：

1. `docs/PROJECT_SPEC.md` — 产品总纲
2. `docs/PROJECT_PROGRESS.md` — 当前进度
3. 本文件 — Sprint 1 数据模型与实施计划

然后从 `当前状态` 和 `下一步开发任务` 继续，不要重新设计已经确认的产品目标。
