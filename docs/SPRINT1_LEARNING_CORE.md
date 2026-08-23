# Sprint 1 — Learning Core

> Sprint: Sprint 1  
> Status: In Progress  
> Current Step: Step 7 — Integration  
> MVP World: JavaScript Async World  
> AI Dependency: None

---

## 1. Sprint Goal

让 Frontend Quest 从“知道玩家通关了什么 Quest”逐步升级为“知道玩家掌握了什么能力”。

本 Sprint 不追求完成完整的自适应学习系统，而是建立最小 Learning Core：

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

所有核心规则必须在没有 AI 的情况下正常运行。

---

## 2. 当前 MVP 范围

只实现一个知识世界：**JavaScript Async World**。

知识范围：

- Promise
- Promise State
- Microtask
- Event Loop
- async / await
- Race Condition

暂不扩展：

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

## 3. Sprint Step

| Step | 内容 | 状态 |
|---|---|---|
| 1 | 仓库盘点 + Learning Core 第一版数据模型设计 | ✅ |
| 2 | Knowledge Model | ✅ |
| 3 | Quest Content Schema | ✅ |
| 4 | Skill / Evidence / Mastery | ✅ |
| 5 | Calibration | ✅ |
| 6 | Async World 最小内容集 | ✅ |
| 7 | Integration | 🟡 当前 |
| 8 | Tests | ⬜ |

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

在现有 `Quest` 上进行最小扩展，没有引入新的 `QuestDefinition` / Runtime 模型：

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

三个现有 Quest 已全部声明 Learning metadata，并保持原有 prerequisite / progression 不变。

---

# Step 4 — Skill / Evidence / Mastery

## 状态

**已完成。**

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

Evidence 表示一次实际学习行为产生的事实。一个 Quest 可以通过多个 `skillDimensions` 产生多条 Evidence；Pass / Fail 都产生 Evidence；Evidence 使用最终 Evaluation Score。

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

# Step 5 — Calibration

## 状态

**已完成。**

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

# Step 6 — Async World 最小内容集

## 状态

**已完成。**

Step 6 将已经建立的 Learning Core Schema 填充为一个完整的最小 Async World Content Pack，而不是继续扩展 Domain 或 Runtime。

### Knowledge

保持现有 6 个节点：

- Promise
- Promise State
- Microtask
- Event Loop
- async / await
- Race Condition

### Quest

当前 6 个 Quest：

```text
promise-basics
promise-state
promise-chain
event-loop
async-await-final
race-condition
```

其中：

- `promise-state`：新增 Promise 三态学习 Quest
- `event-loop`：新增 Event Loop 执行顺序 Quest
- `race-condition`：新增异步竞争条件 Debug Quest

所有 KnowledgeNode 均被至少一个 Quest 覆盖；所有 Quest 均声明 Knowledge、SkillDimension、QuestType。

### Progression 兼容

保持原有主线：

```text
promise-basics
    ↓
promise-chain
    ↓
async-await-final
```

新增内容不插入原有主线，因此旧存档中已经完成 `promise-basics + promise-chain` 的玩家不会因为新增 Quest 被强制重新学习。

`race-condition` 在 `async-await-final` 后继续主线；`event-loop` 作为新增内容不改变原有 `async-await-final` prerequisite。

### Chapter

Chapter 内容与 Quest Content 保持同步，Async World 的最小 Quest 集均纳入当前 Chapter Content。

### Boss

当前仓库已有 Boss Runtime / State Machine，但没有独立 Boss Content Schema。Step 6 因此不新增 Boss Runtime 或新模型；综合 Boss Content 留待后续在现有规则内处理。

### 回归

Step 6 实现过程中曾出现 `progressMigration` 回归：把 `event-loop` 插入原有 `async-await-final` prerequisite 会导致旧存档无法自动解锁。已修正并由用户重新运行测试验证通过。

用户本地验证通过：

```text
npm test       ✅
npm run build  ✅
```

### 边界

Step 6 没有新增 Knowledge Domain、Graph Engine、AI、动态 Quest、推荐算法，也没有修改 Evaluation、XP、Unlock、Boss Runtime、Evidence 或 Mastery 规则。

Step 6 已完成设计、实现、测试、用户验证。

---

# Step 7 — Integration

## 状态

**当前步骤。**

目标：把已经独立完成的 Learning Core 接入现有游戏 Runtime，而不是重写 Runtime。

目标闭环：

```text
Player
 ↓
Quest
 ↓
Evaluation
 ↓
SkillEvidence
 ↓
SkillMastery
```

Integration 重点检查：

- `gameStore` 在 Quest 提交成功后如何调用 Evidence use case
- Skill Evidence / Mastery 的持久化边界
- 是否需要扩展 Player Progress
- 不改变 XP / Unlock / Boss / Chapter / Quest Evaluation
- 不把 Calibration 结果混入正常 Skill Evidence
- 保持 Domain 不依赖 React

Step 7 不提前实现 UI 学习分析页面、不接 AI、不修改既有 Truth Layer 规则。

---

# Step 8 — Tests

为 Sprint 1 核心规则建立稳定测试，至少覆盖 Knowledge Model、Quest → Knowledge、Evaluation → Evidence、Evidence → Mastery、Calibration 和现有 Quest / Boss 回归。

---

# Sprint Exit Criteria

Sprint 1 完成后，系统至少应该能够回答：

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
- 文档能够准确描述实际代码状态

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
