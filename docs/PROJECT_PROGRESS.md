# Frontend Quest — Project Progress

> 这是跨对话恢复项目上下文的**进度状态文件**。
> 每完成一个明确功能 / Sprint 步骤，必须同步更新本文件。
> 产品长期目标与架构原则见 `docs/PROJECT_SPEC.md`。

---

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 2 — Experience Core
- **当前阶段:** Step 1 — Experience Flow
- **AI:** 暂不接入
- **Sprint 1:** 已完成
- **下一步:** Step 1 — Experience Flow
- **最后更新:** 2026-08-24

---

# Sprint 1 — Learning Core

Sprint 1 已完成设计、实现、测试、用户验证与文档同步。

| Step | 内容 | 状态 |
|---|---|---|
| 1 | 仓库盘点 + 第一版数据模型设计 | ✅ |
| 2 | Knowledge Model | ✅ |
| 3 | Quest Content Schema | ✅ |
| 4 | Skill / Evidence / Mastery | ✅ |
| 5 | Calibration | ✅ |
| 6 | Async World 最小内容集 | ✅ |
| 7 | Learning Core Integration | ✅ |
| 8 | Tests | ✅ |

### Sprint 1 最终闭环

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
    ↓
Persistence
```

Sprint 1 已验证：

- Knowledge 与 Quest 分离
- Content 与 Player Progress 分离
- Quest Evaluation → Skill Evidence → Skill Mastery
- Calibration 与 Skill Evidence 隔离
- Learning State 独立持久化
- Legacy Save 兼容
- 不依赖 AI
- 不修改原有 Quest Evaluation / XP / Unlock / Boss / Chapter 规则

用户最终验证通过：

```text
npm test       ✅
npm run build  ✅
```

详细记录见 `docs/SPRINT1_LEARNING_CORE.md`。

---

# Sprint 2 — Experience Core

## Sprint Goal

让现有 Quest Runtime 从“能够完成 Quest”进一步形成完整、可持续的游戏体验：

```text
Quest
 ↓
Evaluation
 ↓
Success / Failure
 ↓
XP / Progress / Recovery
 ↓
Unlock / Level / Boss
 ↓
继续挑战
```

Sprint 2 优先复用 Sprint 1 和现有 Runtime，不进行大规模重构。

## Step 1 — Experience Flow 🟡 当前

目标：明确 Experience Core 的最小边界，并在不引入新 Runtime 状态机的情况下整理现有 Quest / XP / Progress / Recovery 能力。

当前确认的原则：

1. **Level 是 XP 的派生状态**，第一版不作为独立持久化状态。
2. **Chapter / World Progress 从 QuestProgress 派生**，第一版不维护三套独立持久化状态。
3. **Failure Recovery 复用现有 Result + retryQuest() 流程**，不新增 Recovery Engine / Retry Engine。
4. 不新增统一的 `ExperienceState` 大模型。
5. 不修改现有 Quest Evaluation 行为。
6. 不修改现有 XP / Unlock / Boss / Chapter 规则，除非后续 Step 明确需要且单独验证。

## Sprint 2 Step 计划

| Step | 内容 | 状态 |
|---|---|---|
| 1 | Experience Flow / 状态边界 | 🟡 当前 |
| 2 | Quest Experience Flow | ⬜ |
| 3 | Failure Recovery | ⬜ |
| 4 | XP / Level / Progress | ⬜ |
| 5 | Boss Experience | ⬜ |
| 6 | Integration + Tests | ⬜ |

## Sprint 2 明确不做

- AI
- Adaptive Quest Selection
- Spaced Review
- 新 Knowledge Domain
- React / TypeScript 学习内容
- 复杂剧情
- Inventory / Gold / Equipment / Gacha
- Leaderboard / Social / Multiplayer
- 复杂 Boss Engine
- 复杂状态机
- Learning Analytics Dashboard
- 复杂推荐算法

Adaptive Core 留待后续 Sprint。

---

## 跨对话恢复规则

新的对话必须先阅读：

1. `docs/PROJECT_SPEC.md` — 产品总纲
2. `docs/PROJECT_PROGRESS.md` — 当前进度
3. 当前 Sprint 文档 — 当前 Sprint 数据模型与实施计划

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
