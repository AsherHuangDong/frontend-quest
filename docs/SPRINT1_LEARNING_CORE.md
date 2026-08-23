# Sprint 1 — Learning Core

> Sprint: Sprint 1  
> Status: Completed  
> Current Step: Step 8 — Tests (completed)  
> MVP World: JavaScript Async World  
> AI Dependency: None

---

## 1. Sprint Goal

让 Frontend Quest 从“知道玩家通关了什么 Quest”逐步升级为“知道玩家掌握了什么能力”。

本 Sprint 建立最小 Learning Core：

```text
Knowledge
    ↓
Quest
    ↓
Evaluation
    ↓
Evidence
    ↓
Mastery
```

所有核心规则在没有 AI 的情况下正常运行。

---

## 2. Sprint Scope

只实现一个知识世界：**JavaScript Async World**。

知识范围：

- Promise
- Promise State
- Microtask
- Event Loop
- async / await
- Race Condition

本 Sprint 不扩展：

- React
- TypeScript
- CSS
- Browser
- Webpack
- Algorithm
- AI 出题 / AI Judge
- 复杂推荐算法
- ML / Bayesian Mastery

---

## 3. Sprint Steps

| Step | 内容 | 状态 |
|---|---|---|
| 1 | 仓库盘点 + Learning Core 第一版数据模型设计 | ✅ |
| 2 | Knowledge Model | ✅ |
| 3 | Quest Content Schema | ✅ |
| 4 | Skill / Evidence / Mastery | ✅ |
| 5 | Calibration | ✅ |
| 6 | Async World 最小内容集 | ✅ |
| 7 | Integration | ✅ |
| 8 | Tests | ✅ |

---

# Step 1 — 仓库盘点 + 第一版数据模型设计

## 状态

**已完成。**

核心边界：

```text
Knowledge ≠ Quest
Content ≠ Player Progress
Runtime ≠ Persistence
Evaluation ≠ Mastery
```

Skill Dimension 初版：

```text
Recall
Understand
Apply
Debug
Transfer
```

---

# Step 2 — Knowledge Model

## 状态

**已完成。**

实现：

```text
src/domain/knowledge/types.ts
src/content/knowledge/asyncWorld.ts
src/content/knowledge/asyncWorld.test.ts
```

最小模型：

```text
World
 │
 └── KnowledgeNode
          │
          └── prerequisiteIds
```

Async World 第一版包含 Promise、Promise State、Microtask、Event Loop、async / await、Race Condition。

Step 2 不修改 Quest Evaluation、XP、Unlock、Boss、Chapter、GameStore、Quest Progress，也没有提前实现 Skill、Evidence、Mastery、Calibration 或 AI。

用户本地验证：

```text
npm test       ✅
npm run build  ✅
```

---

# Step 3 — Quest Content Schema

## 状态

**已完成。**

实现：

```text
src/domain/quest/types.ts
src/content/quests.ts
src/content/quests.test.ts
```

在现有 `Quest` 上进行最小扩展，没有引入新的 `QuestDefinition` / Runtime 模型。

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

---

# Step 4 — Skill / Evidence / Mastery

## 状态

**已完成。**

实现：

```text
src/domain/skill/types.ts
src/domain/skill/mastery.ts
src/domain/skill/mastery.test.ts
src/application/useCases/recordQuestSkillEvidence.ts
src/application/useCases/recordQuestSkillEvidence.test.ts
```

最小模型：

```text
EvaluationResult
      ↓
SkillEvidence[]
      ↓
SkillMasteryMap
```

Evidence 表示一次实际学习行为产生的事实。一个 Quest 可以通过多个 `skillDimensions` 产生多条 Evidence；Pass / Fail 都产生 Evidence；Evidence 使用最终 Evaluation Score。

Mastery 是 Evidence 的派生状态，MVP 使用确定性的简单平均：

```text
mastery.score = average(all evidence scores for this skill)
```

---

# Step 5 — Calibration

## 状态

**已完成。**

实现：

```text
src/domain/calibration/types.ts
src/domain/calibration/calibration.ts
src/domain/calibration/calibration.test.ts
```

规则：

- Calibration Score 使用所有回答分数的简单平均。
- Level 使用 Calibration Quest 的最高连续通过层级确定。
- Calibration 不产生 SkillEvidence。
- Calibration 不修改 SkillMastery。
- Calibration 不修改 QuestProgress。
- Calibration 不修改现有 Unlock 规则。
- `recommendedQuestId` 只表达推荐起点。

没有引入 AI、IRT、Bayesian、自适应选题、复杂推荐、Calibration History 或 UI。

---

# Step 6 — Async World 最小内容集

## 状态

**已完成。**

Knowledge：

- Promise
- Promise State
- Microtask
- Event Loop
- async / await
- Race Condition

Quest：

```text
promise-basics
promise-state
promise-chain
event-loop
async-await-final
race-condition
```

所有 KnowledgeNode 均被至少一个 Quest 覆盖；所有 Quest 均声明 Knowledge、SkillDimension、QuestType。

保持原有主线：

```text
promise-basics
    ↓
promise-chain
    ↓
async-await-final
```

新增内容不插入原有主线，因此旧存档不会因为新增 Quest 被强制重新学习。

Step 6 实现过程中曾出现 `progressMigration` 回归，已修正并由用户重新运行测试验证通过。

---

# Step 7 — Learning Core Integration

## 状态

**已完成。**

核心链路：

```text
submitAnswer()
      ↓
submitQuest()
      ↓
EvaluationResult
      ├──────────────→ Quest Progress
      ├──────────────→ XP / Streak
      │
      └──────────────→ recordQuestSkillEvidence()
                             ↓
                       SkillEvidence
                             ↓
                       SkillMastery
                             ↓
                        GameSave
```

`GameSave` 增加独立 Learning State：

```ts
learning: {
  skillEvidence: SkillEvidence[];
  skillMastery: SkillMasteryMap;
}
```

每次真实 Quest 提交都会产生 Evidence：Pass / Fail / Replay 均保留学习证据；Mastery 基于完整历史 Evidence 重新计算。

继续使用现有 `GameRepository` / `LocalStorageGameRepository`，旧存档缺少 `learning` 时自动初始化为空 Learning State，不修改现有 `version: 1`。

Step 7 没有修改 Quest Evaluation、XP、Unlock、Boss、Chapter、Calibration 或 Mastery 算法。

---

# Step 8 — Tests

## 状态

**已完成。**

Step 8 不新增产品能力，只补齐 Sprint 1 Learning Core 的回归测试边界。

新增 / 补充：

```text
src/application/gameStore.test.ts
src/infrastructure/persistence/localStorageGameRepository.test.ts
```

覆盖：

- Quest Pass → Evidence → Mastery
- Quest Fail → Evidence
- Replay → Evidence 累积 → Mastery 重算
- GameStore → LocalStorage → Reload
- Legacy Save → 自动初始化 Learning State
- 既有 Domain / Use Case 测试继续通过

用户最终验证通过：

```text
npm test       ✅
npm run build  ✅
```

---

# Sprint Exit Criteria

Sprint 1 完成后，系统能够回答：

```text
玩家完成了什么 Quest？
        ↓
这个 Quest 训练什么知识？
        ↓
这个 Quest 训练什么能力？
        ↓
玩家产生了什么能力证据？
        ↓
玩家当前掌握程度如何？
```

并且：

- MVP 不依赖 AI
- 现有游戏闭环正常
- Learning Core 与 UI 解耦
- Content 与 Player Progress 解耦
- 核心规则可测试、可解释
- 文档准确描述 Sprint 1 实际状态

**Sprint 1 — Learning Core 已完成。**

下一阶段：`Sprint 2 — Experience Core`。

---

# 开发流程

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
