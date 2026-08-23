# Frontend Quest — Project Progress

> 这是跨对话恢复项目上下文的**进度状态文件**。
> 每完成一个明确功能 / Sprint 步骤，必须同步更新本文件。
> 产品长期目标与架构原则见 `docs/PROJECT_SPEC.md`。

---

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 1 — Learning Core
- **当前阶段:** Step 3 完成：Quest Content Schema
- **AI:** 暂不接入
- **下一步:** Step 4 — Skill / Evidence / Mastery
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

### Content

现有 3 个 Quest 均已声明 Learning metadata：

- `promise-basics` → `promise` → recall / understand → understand
- `promise-chain` → `promise`, `microtask` → understand / apply → reason
- `async-await-final` → `promise`, `event-loop`, `async-await` → apply / debug / transfer → reason

测试覆盖：

- 所有 Quest 都有 Knowledge 引用
- Knowledge ID 必须存在于 Async World
- SkillDimension 必须属于已定义集合
- QuestType 必须属于已定义集合
- 原有 Quest progression order 与 prerequisite 不变

### 边界

Step 3 只增加 Content Schema，不改变 Runtime 行为。

没有修改：

- Challenge / Evaluation
- `submitQuest`
- XP
- Unlock
- Boss
- Chapter
- GameStore
- Player Progress

没有提前实现：

- SkillEvidence
- SkillMastery
- Player Skill State
- Calibration
- Knowledge Progress
- AI
- Recommendation
- Graph Engine

### 验证

用户本地验证通过：

```text
npm test       ✅
npm run build  ✅
```

Step 3 已完成设计、实现、测试和用户验证。

---

# 当前 Sprint 计划

| Step | 内容 | 状态 |
|---|---|---|
| 1 | 仓库盘点 + 第一版数据模型设计 | ✅ |
| 2 | Knowledge Model | ✅ |
| 3 | Quest Content Schema | ✅ |
| 4 | Skill / Evidence / Mastery | 🟡 下一步 |
| 5 | Calibration | ⬜ |
| 6 | Async World 最小内容集 | ⬜ |
| 7 | Integration | ⬜ |
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
