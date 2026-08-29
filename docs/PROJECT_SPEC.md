# Frontend Quest — Product & Architecture Specification

> Version: v0.2  
> Status: MVP Implementation / Experience Polish  
> Repository: https://github.com/AsherHuangDong/frontend-quest  
> Current MVP: Async World  
> AI Dependency: None  
> Long-term Direction: AI-native Adaptive Learning & Assessment

---

## 1. 项目定位

Frontend Quest 是一个将前端知识学习、能力训练和能力考核融合进游戏世界的自适应学习系统。

它不是传统题库，也不是简单的“游戏化刷题”。核心目标是：让学习者通过探索、挑战、失败、反馈、突破和复习，最终获得真实的前端工程能力。

### 核心愿景

> 把学习变成冒险，把考试变成实战，把 AI 变成教练，把知识变成能力。

---

## 2. 为什么做这个产品

传统学习 / 面试模式通常是：

```text
知识 → 题库 → 答题 → 分数 → 结束
```

主要问题：

- 学习容易带来焦虑、压力、拖延和抗拒
- 题库主要验证“知道答案”，不能充分验证“能解决问题”
- 新手和老手面对同一条题目路径，容易出现过难或过简单
- 很多系统关注当下答对，而不是长期记忆和迁移能力
- 用户常常看不见自己的成长，也不知道下一步应该学什么

Frontend Quest 的目标不是把题库加上 XP，而是重新设计学习体验。

---

## 3. 产品核心理念

### 3.1 学习不是背答案

```text
探索 → 尝试 → 失败 → 发现问题 → 理解 → 再次尝试 → 掌握 → 迁移
```

### 3.2 失败不是惩罚

错误是学习事件，而不是能力不足的证明。

```text
失败 → 识别错误 → Hint → Retry → 理解 → 掌握
```

### 3.3 游戏不是奖励层

XP、等级、Boss 等机制不是目的。真正的奖励是“我真的变强了”。游戏机制负责把成长显性化。

### 3.4 同一世界，不同路径

不简单提供 Easy / Normal / Hard 三套题库，而是在同一知识世界中，根据玩家能力选择不同挑战。

### 3.5 Progress over Pressure

让玩家看到成长，而不是制造焦虑。

### 3.6 Autonomy over Obligation

鼓励自主选择，而不是强迫学习。

---

## 4. 用户类型

### 新手

目标：快速建立前端知识地图。需要低进入门槛、解释、即时反馈和明确的胜任感。

### 有开发经验的用户

目标：巩固基础、发现薄弱点、突破瓶颈。应尽量跳过已掌握的简单知识，快速进入 Debug、Scenario、Transfer 等挑战。

### 求职用户

目标：提升面试和实际工程能力。长期支持 Coding、Debug、Scenario、System Design 和 Interview。

---

## 5. 核心产品模型

```text
Knowledge Graph
      ↓
Learning Engine
      ↓
Quest System
      ↓
Assessment Engine
      ↓
Player Skill Model
      ↓
Adaptive Engine
      ↓
Spaced Review
```

外围系统：Experience Engine、Game System、AI Extension。

---

## 6. Knowledge Graph

知识不是简单列表，而是存在 prerequisite、dependency、related concept、application、transfer 等关系。

Async World 示例：

```text
Promise
├── Promise State
├── then
├── catch
├── finally
└── Microtask
    └── Event Loop
        └── async / await
```

长期目标是能够判断“玩家不是 Promise 不会，而是 Microtask 理解不足”。

---

## 7. Skill Model

MVP 使用以下能力维度：

```text
Recall
Understand
Apply
Debug
Transfer
```

每项 0~100。

未来可以增加 Retention、Reasoning、Design、Communication 等维度。

重点：Mastery 不只是一个总分，而是能力结构。

---

## 8. Quest

Quest 是最小学习 / 训练单位，不等于传统题目。Quest 的目标是获得能力证据，而不是只回答一个问题。

MVP / 长期支持的 Quest 类型：

- Concept
- Recall
- Output
- Reasoning
- Code
- Debug
- Scenario
- Design
- Boss

---

## 9. Boss

Boss 是阶段性能力验证。例如 Async World 的 Boss 综合 Promise、Microtask、Event Loop、async/await、Race Condition。

Boss 的意义：证明玩家是否真正掌握一个能力区域。

---

## 10. Assessment

最终答案不是唯一证据。长期目标是综合：

```text
Outcome + Reasoning + Process + Verification + Transfer
```

MVP 优先使用确定性证据：答案、代码运行结果、测试结果、行为、重试、完成时间等。

---

## 11. Adaptive Learning

玩家不要求按固定 Quest 1 → Quest 2 → Quest 3 前进，而是：

```text
Player Model → Mastery / Weakness → Next Quest
```

基本规则：掌握高则提高难度；掌握低则降低难度；能力明显薄弱则优先训练；已经掌握则跳过基础题。

---

## 12. Calibration

第一次进入知识领域时先做少量 Calibration Quest，而不是强制从第一关开始。

例如：

```text
Q1 Promise
Q2 Microtask
Q3 async/await
```

根据表现选择 Beginner / Intermediate / Advanced 路径。

---

## 13. Spaced Review

MVP 使用简单间隔：

```text
第一次掌握 → 1 天
第二次掌握 → 3 天
第三次掌握 → 7 天
第四次掌握 → 14 天
第五次掌握 → 30 天
```

复习可以表现为 Memory Raid / 知识区域出现衰减，而不是传统“背题”。

---

## 14. Player Goal

首次进入时可以选择：

- 前端入门
- 巩固基础
- 面试准备
- 能力挑战

目标不直接决定难度，而是决定内容优先级。

---

## 15. Player State

MVP 支持简单状态：

```text
🔥 Challenge
🙂 Normal
😴 Low Energy
```

对应高难挑战、正常 Quest、Quick Win / Recall。

---

## 16. Failure Recovery

```text
第一次失败 → 不惩罚 → Hint → Retry
再次失败 → Learn Mode → Explanation → Variation Quest
```

核心原则：失败让玩家发现盲区，而不是证明“我不行”。

---

## 17. Return Experience

中断后回归不制造负罪感。

示例：

> 欢迎回来。你离开了一段时间。部分知识出现记忆衰减。开始恢复。

核心原则：**无罪回归。**

---

## 18. Experience Engine

需要持续设计以下心理体验：

- Curiosity：这是什么？
- Challenge：我能不能做到？
- Discovery：原来是这样。
- Competence：我真的会了。
- Progress：我变强了。
- Flow：再来一个。
- Autonomy：我自己选择挑战什么。

不要把“愉悦”简单理解成奖励刺激；重点是探索、发现、胜任感、成长感和掌控感。

---

## 19. MVP 定义

### MVP 核心目标

验证：

> 一个原本不想学习的人，是否会因为 Frontend Quest 的体验主动完成下一次挑战，并逐渐形成真实能力。

### MVP 范围

只做一个知识领域：**JavaScript Async World**。

范围：

- Promise
- Microtask
- Event Loop
- async / await
- Race Condition

暂不扩展 React、TypeScript、CSS、Browser、Webpack、Algorithm 等领域。

---

## 20. Async World 五个 Zone

```text
Async World
├── Zone 1 · Explore
├── Zone 2 · Understand
├── Zone 3 · Reason
├── Zone 4 · Debug
└── Zone 5 · Boss
```

---

## 21. MVP 游戏机制

保留：

- XP
- Level
- Mastery
- Quest
- Boss
- Achievement
- Progress Map

暂不做：金币、装备、抽卡、排行榜、公会、社交、复杂剧情、多人模式。

---

## 22. AI 策略

### MVP：完全不依赖 AI

核心逻辑必须 deterministic，保证没有 AI 时游戏仍然完整可玩。

### AI 扩展接口

预留：

```ts
interface IQuestGenerator {}
interface IQuestEvaluator {}
interface ICoach {}
interface IInterviewer {}
```

MVP 使用 DeterministicQuestGenerator、DeterministicEvaluator。未来可以替换为 AIQuestGenerator、AICoach、AIInterviewer。

### AI 边界

AI 适合承担：Hint、Explanation、Socratic Question、Variation、Scenario、Interview。

AI 不应该直接决定：XP、Level、Unlock、Mastery、Pass / Fail。

核心原则：

> **AI 是 Teaching Layer，不是 Truth Layer。**

### Truth Layer

知识正确性由 Knowledge Graph、Quest Definition、Test、Validator、Expected Result 保证，避免模型幻觉污染核心学习结果。

---

## 23. 长期产品形态：Knowledge Arena

最终不是题库，而是模拟真实问题解决：

```text
Knowledge World
      ↓
Scenario
      ↓
Player Action
      ↓
AI Observation
      ↓
Adaptive Challenge
      ↓
Skill Assessment
```

例如 Production Incident：玩家阅读代码、查日志、修改代码、运行测试、解释原因；系统评估 Root Cause Analysis、Debugging、Verification、Architecture、Transfer。

长期可扩展 AI Coach、AI Generator、AI Interview，以及动态的 Senior / Tech Lead 面试副本。

---

## 24. MVP 验证指标

### H1：愿意继续

- Quest Completion
- Next Quest Click Rate
- Session Length

### H2：感觉变强

- Mastery Growth
- Boss Success Rate
- Self-reported Competence

### H3：愿意回来

- D1 / D3 / D7 Return Rate
- Memory Raid Completion

重点不是“功能完成率”，而是验证产品体验假设。

---

## 25. Sprint 计划

### Sprint 1 — Learning Core ✅

范围：Knowledge、Quest、Skill、Mastery、Calibration（Domain）。

目标：系统知道玩家会什么。

### Sprint 2 — Experience Core ✅

范围：Quest Flow、Failure Recovery、XP、Level、Boss、Progress。

目标：系统真的像一个游戏。

### Sprint 3 — Adaptive Core ✅

范围：Calibration、Difficulty、Quest Selection、Spaced Review。

目标：不同玩家开始拥有不同路径。

### Sprint 4 — Experience Polish 🟡

范围：Onboarding、Feedback、Animation、Interaction、Progress Visualization、Copywriting。

目标：让玩家愿意继续。

执行计划：`docs/SPRINT4_EXPERIENCE_POLISH.md`

---

## 26. 当前开发阶段

Sprint 1–3 与 MVP P0 体验层已完成，用户可本地完整体验：

```text
定级（可选）→ 下一题 → 答题 → 反馈 → 存档 → 复习 due
```

### 当前明确目标

> **Sprint 4 — Experience Polish：打磨反馈、进度感知与文案，服务 H1/H2/H3 验证。**

### 当前明确不做

- AI
- React / TypeScript 等其他 Chapter
- 社交 / 排行榜
- 商业化
- 复杂剧情
- 装备 / 金币 / 抽卡
- 多人模式
- AI 自动出题
- 复杂推荐算法

除非 MVP 验证证明确实需要，否则不要提前实现长期能力。

---

## 27. 架构原则

1. **Core First, AI Optional**：核心学习能力不依赖 AI。
2. **Evidence over Answer**：能力判断基于证据，而不是单一答案。
3. **Challenge over Question**：优先设计挑战，而不是题目。
4. **Mastery over Score**：关注能力掌握，而不是考试分数。
5. **Progress over Pressure**：让玩家看到成长，而不是制造焦虑。
6. **Failure is Data**：失败是学习数据。
7. **Autonomy over Obligation**：鼓励自主选择。
8. **Smallest Valid Experiment**：任何新功能先问能否用更小实验验证。
9. **Content 与 Player Progress 分离**。
10. **Runtime 与持久化 Save 分离**。
11. **Domain 不依赖 React**。
12. **Store 负责状态协调，不成为业务逻辑垃圾桶**。
13. **Evaluation 使用统一结果模型，为未来 Code Judge / AI Judge 留扩展点**。
14. **LocalStorage 通过 Repository 接口访问，未来可替换真实后端。**

---

## 28. 给后续开发对话的上下文

新对话开始时，先阅读本文件与 `docs/PROJECT_PROGRESS.md`，不要重新定义项目目标。

推荐提示词：

> 你现在负责继续开发 Frontend Quest。请先阅读 `docs/PROJECT_SPEC.md` 与 `docs/PROJECT_PROGRESS.md`。当前目标是 Async World MVP 的 Experience Polish（Sprint 4）。不接入 AI。所有新增功能必须优先服务 H1/H2/H3 验证，不要提前实现长期愿景。请先检查差距，然后给出最小下一步并实施。

---

## 29. 产品成功标准

Frontend Quest MVP 不是“功能很多”才成功。

真正需要证明的是：

```text
抗拒学习
   ↓
好奇
   ↓
尝试
   ↓
发现问题
   ↓
理解
   ↓
成功
   ↓
能力感
   ↓
主动挑战下一关
   ↓
几天后主动回来
   ↓
在新的场景中仍然能够使用
```

如果这个闭环成立，再扩展更多知识领域和 AI 能力。

如果这个闭环不成立，不应该通过继续堆叠 AI、知识图谱、排行榜等复杂功能掩盖问题。

---

## 30. 当前下一步

**Sprint 4 / Experience Polish：**

1. 基于 P0 自测整理体验痛点清单。
2. 打磨 Feedback 与失败文案。
3. 增强 Progress / Mastery 可视化。
4. 统一 Onboarding 与关键文案。
5. 强化 Review / Return（无罪回归）感知。
6. 可选轻量动效与交互一致性。
7. 准备并执行小范围体验测试（H1）。

详见 `docs/SPRINT4_EXPERIENCE_POLISH.md`。
