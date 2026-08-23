# Frontend Quest — Project Progress

> 这是跨对话恢复项目上下文的**进度状态文件**。
> 每完成一个明确功能 / Sprint 步骤，必须同步更新本文件。
> 产品长期目标与架构原则见 `docs/PROJECT_SPEC.md`。

---

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 1 — Learning Core
- **当前阶段:** Step 6 完成：Async World 最小内容集
- **AI:** 暂不接入
- **下一步:** Step 7 — Integration
- **最后更新:** 2026-08-24

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

Step 1 已完成。确认核心原则：Content 与 Player Progress 分离、Knowledge 与 Quest 分离、Quest 是训练载体、Evaluation → Evidence → Mastery、Calibration 独立、AI 不进入 Truth Layer，并采用渐进式扩展而不是一次性大重构。

---

# Step 2 — Knowledge Model ✅

### 实现

```text
src/domain/knowledge/types.ts
src/content/knowledge/asyncWorld.ts
src/content/knowledge/asyncWorld.test.ts
```

### 最小模型

```text
World
 │
 └── KnowledgeNode
          │
          └── prerequisiteIds
```

`KnowledgeNode`：

```ts
interface KnowledgeNode {
  id: string;
  worldId: string;
  title: string;
  description: string;
  prerequisiteIds: string[];
}
```

Async World 第一版包含：Promise、Promise State、Microtask、Event Loop、async / await、Race Condition。

Step 2 保持 Quest Evaluation、XP、Unlock、Boss、Chapter、GameStore、Quest Progress 不变；没有提前实现 Skill、Evidence、Mastery、Calibration、AI、Graph Engine 或 Player Knowledge Progress。

验证：

```text
npm test       ✅
npm run build  ✅
```

---

# Step 3 — Quest Content Schema ✅

### 实现

```text
src/domain/quest/types.ts
src/content/quests.ts
src/content/quests.test.ts
```

### Quest Schema

在现有 `Quest` 上做最小扩展，没有引入新的 `QuestDefinition` / Runtime 模型：

```ts
type QuestType = 'explore' | 'understand' | 'reason' | 'debug';

type SkillDimension =
  | 'recall'
  | 'understand'
  | 'apply'
  | 'debug'
  | 'transfer';

interface Quest {
  // existing fields...
  knowledgeNodeIds: string[];
  skillDimensions: SkillDimension[];
  type: QuestType;
}
```

现有 3 个 Quest 均已声明 Learning metadata，并保持原有 prerequisite / progression 不变。

---

# Step 4 — Skill / Evidence / Mastery ✅

## 实现

```text
src/domain/skill/types.ts
src/domain/skill/mastery.ts
src/domain/skill/mastery.test.ts
src/application/useCases/recordQuestSkillEvidence.ts
src/application/useCases/recordQuestSkillEvidence.test.ts
```

## 最小模型

```text
EvaluationResult
      ↓
SkillEvidence[]
      ↓
SkillMasteryMap
```

### SkillEvidence

Evidence 表示一次实际学习行为产生的事实：

```ts
interface SkillEvidence {
  id: string;
  questId: string;
  knowledgeNodeIds: string[];
  skillDimension: SkillDimension;
  score: number;
  passed: boolean;
  createdAt: string;
}
```

一个 Quest 可以通过多个 `skillDimensions` 产生多条 Evidence。Pass / Fail 都产生 Evidence，Evidence 使用最终 Evaluation Score。

### SkillMastery

```ts
interface SkillMastery {
  skillDimension: SkillDimension;
  score: number;
  evidenceCount: number;
  updatedAt: string;
}
```

Mastery 是 Evidence 的派生状态，MVP 使用确定性的简单平均：

```text
mastery.score = average(all evidence scores for this skill)
```

没有 Evidence 时不生成 Mastery。

### 边界

Step 4 没有改变现有 Evaluation、Quest Progress、XP、Unlock、Boss、Chapter、GameStore 行为，也没有提前实现 Calibration、AI、推荐、复杂 Mastery 算法、Knowledge Mastery 或 UI。

Skill Progress 与 Quest Progress 保持独立；Evidence 作为可解释的学习事实，Mastery 作为其派生结果。

### 验证

用户本地验证通过：

```text
npm test       ✅
npm run build  ✅
```

Step 4 已完成设计、实现、测试和用户验证。

---

# Step 5 — Calibration ✅

## 实现

```text
src/domain/calibration/types.ts
src/domain/calibration/calibration.ts
src/domain/calibration/calibration.test.ts
```

## 最小模型

```text
CalibrationDefinition
        ↓
CalibrationAttempt
        ↓
CalibrationResult
        ↓
recommendedQuestId
```

Calibration 复用现有 Quest Content，不创建新的 CalibrationQuest / AssessmentQuest 类型体系。

### 规则

- Calibration Score 使用所有回答分数的简单平均。
- Level 使用 Calibration Quest 的最高连续通过层级确定。
- Calibration 不产生 SkillEvidence。
- Calibration 不修改 SkillMastery。
- Calibration 不修改 QuestProgress。
- Calibration 不修改现有 Unlock 规则。
- `recommendedQuestId` 只表达推荐起点，真正接入游戏 Runtime 留到 Step 7。

### 边界

Step 5 没有引入 AI、IRT、Bayesian、自适应选题、复杂推荐、Calibration History、UI，也没有重构 Quest / Progress / GameStore。

### 验证

用户本地验证通过：

```text
npm test       ✅
npm run build  ✅
```

Step 5 已完成设计、实现、测试和用户验证。

---

# Step 6 — Async World 最小内容集 ✅

## 实现

Async World Content 已补齐到最小可玩内容集：

```text
Knowledge
├── Promise
├── Promise State
├── Microtask
├── Event Loop
├── async / await
└── Race Condition
```

Quest：

```text
promise-basics
promise-state
promise-chain
event-loop
async-await-final
race-condition
```

### 内容覆盖

- 每个 Quest 都声明 Knowledge、SkillDimension 和 QuestType。
- 六个 Async World KnowledgeNode 全部至少被一个 Quest 覆盖。
- 新增 `promise-state`、`event-loop`、`race-condition` Quest。
- 保持原有主线兼容：`async-await-final` 仍依赖 `promise-chain`，避免破坏已有存档迁移。
- `race-condition` 在 `async-await-final` 后继续主线。
- Chapter 内容与 Quest Content 保持同步。

### 迁移回归

Step 6 实现过程中发现新增 Quest 插入原主线会破坏旧存档 `progressMigration` 的 unlock 预期，已修正为不改变原有 `promise-basics → promise-chain → async-await-final` 主线，并增加新的学习节点/Quest，不强迫旧玩家重新完成新增 Quest。

用户本地验证通过：

```text
npm test       ✅
npm run build  ✅
```

### 边界

Step 6 没有新增 Knowledge Domain、Graph Engine、AI、动态 Quest、推荐算法，也没有修改 Evaluation、XP、Unlock、Boss Runtime、Mastery 或 Evidence 规则。

当前没有新增独立 Boss Content Schema；Boss Runtime 保持现有实现，综合 Boss Content 留待需要时在现有规则内处理。

Step 6 已完成设计、实现、测试、用户验证。

---

# 当前 Sprint 计划

| Step | 内容 | 状态 |
|---|---|---|
| 1 | 仓库盘点 + 第一版数据模型设计 | ✅ |
| 2 | Knowledge Model | ✅ |
| 3 | Quest Content Schema | ✅ |
| 4 | Skill / Evidence / Mastery | ✅ |
| 5 | Calibration | ✅ |
| 6 | Async World 最小内容集 | ✅ |
| 7 | Integration | 🟡 下一步 |
| 8 | Tests | ⬜ |

---

# 不在本 Sprint

- AI
- 其他前端知识领域
- 排行榜 / 社交 / 商业化
- 复杂推荐算法
- 金币 / 装备 / 抽卡
- 复杂 Mastery 算法
- 图数据库

详细设计见 `docs/PROJECT_SPEC.md` 和 `docs/SPRINT1_LEARNING_CORE.md`。

---

## 跨对话恢复规则

新的对话必须先阅读：

1. `docs/PROJECT_SPEC.md` — 产品总纲
2. `docs/PROJECT_PROGRESS.md` — 当前进度
3. `docs/SPRINT1_LEARNING_CORE.md` — Sprint 1 数据模型与实施计划

然后从 `当前状态` 和 `下一步开发任务` 继续，不要重新设计已经确认的产品目标。

---

## 开发流程

每完成一个明确 Step / 功能，必须执行：

```text
设计
 ↓
实现
 ↓
测试
 ↓
用户验证
 ↓
Commit
 ↓
更新 PROJECT_PROGRESS.md
 ↓
更新本 Sprint 文档
 ↓
更新 GitHub Issue
 ↓
进入下一 Step
```

**没有完成文档同步，就不视为该功能完整完成。**
