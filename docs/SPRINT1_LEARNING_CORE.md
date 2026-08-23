# Sprint 1 — Learning Core

> Sprint: Sprint 1  
> Status: In Progress  
> Current Step: Step 2 — Knowledge Model  
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
| 2 | Knowledge Model | 🟡 当前 |
| 3 | Quest Content Schema | ⬜ |
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

**当前步骤。尚未开始实现。**

## 目标

将“知识”从现有 Quest 内容中独立出来，使系统能够明确表达：

- 一个 World 是什么
- 一个 Knowledge Node 是什么
- Async World 包含哪些知识节点
- 知识节点之间有什么 prerequisite 关系

## 本 Step 范围

只处理：

```text
World
KnowledgeNode
KnowledgeRelation / prerequisite
Async World Knowledge Content
```

不在本 Step 实现：

- Quest Content Schema
- Skill / Evidence / Mastery
- Calibration
- Adaptive Engine
- AI
- 新 UI
- 复杂知识图数据库

## 设计目标

Knowledge Model 应能够支持类似：

```text
Async World
│
├── Promise
│   ├── Promise State
│   └── then / catch / finally
│
├── Microtask
│
├── Event Loop
│
├── async / await
│
└── Race Condition
```

并能够表达必要的前置关系，例如：

```text
Promise
  ↓
Promise State
  ↓
then / catch / finally
  ↓
Microtask
  ↓
Event Loop
  ↓
async / await
```

实际关系不应为了画图而过度建模，应以 MVP 内容需求为准。

## Step 2 开始前的代码检查要求

实现前必须检查当前实际代码中的：

- `domain/quest`
- `domain/chapter`
- `content/quests`
- `content/chapters`
- `application/gameStore*`
- `application/useCases`
- `domain/progress`

确认 Knowledge Model 与现有模型的兼容边界。

## Step 2 设计原则

1. Domain Model 不依赖 React。
2. Knowledge Content 与 Player Progress 分离。
3. 不为了未来图数据库提前设计复杂 Graph Engine。
4. 不为了 AI 提前增加 AI 特有字段。
5. Knowledge Node 应保持稳定、可被多个 Quest 引用。
6. 不在本 Step 修改现有 Quest Evaluation 行为。
7. 不在本 Step 改变 XP、Unlock、Boss 规则。
8. 优先最小模型，能满足 Async World 即可。

## Step 2 验收标准

完成后至少应满足：

- [ ] 存在明确的 World / Knowledge Node Domain Model。
- [ ] Async World 有独立 Knowledge Content。
- [ ] 可以表达 Knowledge Node 的 prerequisite 关系。
- [ ] Domain 不依赖 React。
- [ ] Knowledge Content 不依赖 Player Progress。
- [ ] 现有 Quest / Boss / Chapter 闭环不回归。
- [ ] 有针对核心 Knowledge Model 的测试。
- [ ] 文档状态与实际代码保持一致。

完成后才进入 Step 3。

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
