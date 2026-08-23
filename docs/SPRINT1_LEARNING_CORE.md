# Sprint 1 — Learning Core

> Sprint: Sprint 1  
> Status: In Progress  
> Current Step: Step 4 — Skill / Evidence / Mastery  
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
| 4 | Skill / Evidence / Mastery | 🟡 当前 |
| 5 | Calibration | ⬜ |
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

## 目标

建立能力证据与掌握度模型：

```text
EvaluationResult
      ↓
SkillEvidence
      ↓
SkillMastery
```

Skill 初版：

```text
Recall
Understand
Apply
Debug
Transfer
```

## MVP 边界

- 不实现复杂统计模型
- 不接入 AI
- 不做 Bayesian / IRT
- 不修改现有 Quest Pass / Fail 规则
- Evidence 是对 Evaluation 的结构化学习证据
- Mastery 属于 Player Progress，不属于 Content

## 当前任务

实现前先检查实际代码并设计最小模型：

- SkillEvidence
- SkillMastery
- EvaluationResult 与 Evidence 的关系
- Evidence 如何影响 Mastery
- Player Progress 中如何保存 Mastery

然后再实现、测试并接入现有 Quest Flow。

---

# Step 5 — Calibration

玩家进入一个知识世界时，通过少量 Calibration Quest 判断初始能力，而不是强制从第一关开始。

初版采用确定性规则，不使用 AI、IRT 或 Bayesian 模型。

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
