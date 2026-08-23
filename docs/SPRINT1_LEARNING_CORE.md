# Sprint 1 — Learning Core

> Sprint: Sprint 1  
> Status: In Progress  
> Current Step: Step 3 — Quest Content Schema  
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

原因：先验证 Learning Core 的产品机制，而不是扩大内容规模。

---

## 3. Sprint Step

| Step | 内容 | 状态 |
|---|---|---|
| 1 | 仓库盘点 + Learning Core 第一版数据模型设计 | ✅ |
| 2 | Knowledge Model | ✅ |
| 3 | Quest Content Schema | 🟡 当前 |
| 4 | Skill / Evidence / Mastery | ⬜ |
| 5 | Calibration | ⬜ |
| 6 | Async World 最小内容集 | ⬜ |
| 7 | Integration | ⬜ |
| 8 | Tests | ⬜ |

---

# Step 1 — 仓库盘点 + 第一版数据模型设计

## 状态

**已完成。**

## 已确定的核心边界

```text
Knowledge ≠ Quest
Content ≠ Player Progress
Runtime ≠ Persistence
Evaluation ≠ Mastery
```

第一版目标模型：

```text
World
├── KnowledgeNode
├── QuestDefinition
├── BossDefinition
└── CalibrationDefinition

Player
├── PlayerGoal
├── QuestProgress
├── SkillMastery
├── SkillEvidence
└── CalibrationResult
```

Skill Dimension 初版：

```text
Recall
Understand
Apply
Debug
Transfer
```

当前代码尚未全部实现这些模型；Step 1 是设计与仓库盘点阶段，不代表所有 Learning Core 类型已经落地。

## 现有代码必须保留的闭环

```text
Chapter
  ↓
Quest
  ↓
Answer
  ↓
Evaluation
  ↓
Pass / Fail
  ↓
XP
  ↓
Unlock
  ↓
Persistence
```

后续 Sprint 1 工作必须采用渐进式扩展，不应一次性推翻现有 Quest、Boss、Chapter、Progress、Store。

---

# Step 2 — Knowledge Model

## 状态

**已完成。**

## 实现

```text
src/domain/knowledge/types.ts
src/content/knowledge/asyncWorld.ts
src/content/knowledge/asyncWorld.test.ts
```

## 最小模型

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

## Async World 第一版

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

## 边界

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

## 验证

用户本地验证通过：

```text
npm test       ✅
npm run build  ✅
```

Knowledge 现在作为独立 Domain / Content Model 存在，但尚未与 Quest Flow 建立运行时关联。

## 验收结论

- [x] World / KnowledgeNode Domain Model
- [x] Async World 独立 Knowledge Content
- [x] prerequisite 关系
- [x] Domain 不依赖 React
- [x] Knowledge Content 与 Player Progress 分离
- [x] 现有 Quest / Boss / Chapter 闭环无回归
- [x] Knowledge Model 测试
- [x] 文档同步

Step 2 已完成，进入 Step 3。

---

# Step 3 — Quest Content Schema

## 目标

让 Quest 明确关联 Knowledge，并能够表达 Quest 的训练目标。

目标方向：

```text
KnowledgeNode
      ↑
      │
QuestDefinition
      │
      ├── challenge
      ├── difficulty
      └── skillDimensions
```

需要保持现有 Quest / Evaluation 兼容，不进行大规模重构。

## 当前范围

实现前先检查实际代码，并确认最小扩展方案：

- Quest 与 KnowledgeNode 建立关联
- Quest 与 SkillDimension 建立关联
- QuestType
- 保持现有 Challenge / Evaluation 兼容

## 验收标准

- [ ] Quest 可以引用一个或多个 Knowledge Node。
- [ ] Quest 可以声明训练的 Skill Dimension。
- [ ] 现有 Challenge / Evaluation 正常工作。
- [ ] 旧 Quest 可以渐进式迁移。
- [ ] 内容与玩家进度继续分离。

---

# Step 4 — Skill / Evidence / Mastery

## 目标

建立能力证据与掌握度模型。

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

MVP 不实现复杂统计模型，优先确定性、可解释的规则。

## 验收标准

- [ ] Evaluation 可以产生 Skill Evidence。
- [ ] Evidence 能关联 Knowledge / Skill Dimension。
- [ ] Player 可以拥有 Skill Mastery。
- [ ] Mastery 更新规则确定性、可解释。
- [ ] 不影响现有 Quest 通关规则。

---

# Step 5 — Calibration

## 目标

玩家进入一个知识世界时，通过少量 Calibration Quest 判断初始能力，而不是强制从第一关开始。

初版可以采用确定性规则：

```text
表现
 ↓
初始能力区间
 ↓
Beginner / Intermediate / Advanced
```

## 原则

Calibration 是能力估计，不是最终 Mastery。

MVP 不使用 AI，也不使用复杂 IRT / Bayesian 模型。

---

# Step 6 — Async World 最小内容集

## 目标

将 Async World 的最小知识、Quest、Boss 内容真正组织起来。

内容需要覆盖：

- Promise
- Promise State
- Microtask
- Event Loop
- async / await
- Race Condition

并至少覆盖：

```text
Explore
Understand
Reason
Debug
Boss
```

重点不是题目数量，而是能力维度覆盖和知识关系覆盖。

---

# Step 7 — Integration

## 目标

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

现有游戏机制继续正常工作。

---

# Step 8 — Tests

## 目标

为 Sprint 1 核心规则建立稳定测试。

至少覆盖：

- Knowledge Model
- Knowledge prerequisite
- Quest → Knowledge mapping
- Evaluation → Evidence
- Evidence → Mastery
- Calibration
- 现有 Quest / Boss 回归

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

- MVP 不依赖 AI。
- 现有游戏闭环正常。
- Learning Core 与 UI 解耦。
- Content 与 Player Progress 解耦。
- 核心规则可测试、可解释。
- 文档能够准确描述实际代码状态。

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
