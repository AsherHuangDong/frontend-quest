# Sprint 1 — Learning Core

> Sprint: Sprint 1  
> Status: In Progress  
> Current Step: Step 5 — Calibration  
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
| 5 | Calibration | 🟡 当前 |
| 6 | Async World 最小内容集 | ⬜ |
| 7 | Integration | ⬜ |
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

三个现有 Quest 已全部声明 Knowledge、Skill Dimension 和 Quest Type。

Step 3 只增加 Content Schema，不改变 Evaluation、submitQuest、XP、Unlock、Boss、Chapter、GameStore 或 Player Progress。

用户本地验证：

```text
npm test       ✅
npm run build  ✅
```

### Step 3 验收

- [x] Quest 可以引用一个或多个 Knowledge Node
- [x] Quest 可以声明 Skill Dimension
- [x] Quest 有独立 QuestType
- [x] Challenge / Evaluation 行为保持不变
- [x] 现有 Quest progression 保持不变
- [x] 内容与玩家进度继续分离
- [x] Schema / 引用完整性测试
- [x] 用户本地验证通过
- [x] 项目文档同步

Step 3 已完成，进入 Step 4。

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

**下一步。**

## 目标

玩家进入 Async World 时，通过少量 Calibration Quest 判断初始能力，而不是简单强制从第一关开始。

Calibration 是能力估计，不是最终 Mastery。

## MVP 原则

- 使用确定性规则
- 不使用 AI
- 不使用 IRT / Bayesian
- 不修改现有 Quest Pass / Fail
- 不直接修改长期 Mastery
- Calibration Result 与 SkillEvidence / SkillMastery 保持语义分离

## 当前设计任务

进入实现前先检查实际代码，并确定最小模型：

```text
CalibrationDefinition
        ↓
CalibrationAttempt
        ↓
CalibrationResult
        ↓
初始能力区间 / 起始位置
```

需要重点决定：

- Calibration Quest 如何声明
- Calibration Result 如何保存
- 如何从结果映射 Beginner / Intermediate / Advanced
- Calibration 如何与现有 Quest Unlock 兼容
- 如何避免 Calibration 污染正常 Quest Evidence / Mastery

---

# Step 6 — Async World 最小内容集

将 Async World 的最小知识、Quest、Boss 内容真正组织起来，覆盖 Explore、Understand、Reason、Debug、Boss。

---

# Step 7 — Integration

将 Learning Core 接入现有游戏 Runtime，而不是重写 Runtime。

目标闭环：

```text
Player
 ↓
Quest
 ↓
Evaluation
 ↓
Evidence
 ↓
Mastery
 ↓
XP / Progress / Unlock
```

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
