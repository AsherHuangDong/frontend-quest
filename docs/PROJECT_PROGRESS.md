# Frontend Quest — Project Progress

> 这是跨对话恢复项目上下文的**进度状态文件**。
> 每完成一个明确功能 / Sprint 步骤，必须同步更新本文件。
> 产品长期目标与架构原则见 `docs/PROJECT_SPEC.md`。

---

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 1 — Learning Core
- **当前阶段:** Step 2 完成：Knowledge Model
- **AI:** 暂不接入
- **下一步:** Step 3 — Quest Content Schema
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

已新增：

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

当前只用 `prerequisiteIds` 表达知识前置关系，不引入通用 Graph / Relation Engine。

### Async World Knowledge

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

### 边界

Step 2 保持以下现有行为不变：

- Quest Evaluation
- XP
- Unlock
- Boss
- Chapter
- GameStore
- Quest Progress

没有提前实现：

- Quest ↔ Knowledge 运行时关联
- Skill
- Evidence
- Mastery
- Calibration
- AI
- Graph Database / Graph Engine
- Player Knowledge Progress

### 验证

```text
npm test       ✅
npm run build  ✅
```

Knowledge 现在作为独立 Domain / Content Model 存在，但尚未与 Quest Flow 建立运行时关联。

---

# 当前 Sprint 计划

## Step 3 — Quest Content Schema

下一步实现：

- Quest 与 KnowledgeNode 建立关联
- Quest 与 SkillDimension 建立关联
- QuestType
- 保持现有 Challenge / Evaluation 兼容

随后依次：

1. Skill / Evidence / Mastery
2. Calibration
3. Async World 最小内容集
4. Integration
5. Tests

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
