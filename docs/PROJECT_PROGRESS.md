# Frontend Quest — Project Progress

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 3 Planning
- **当前阶段:** Sprint 1 / Sprint 2 已完成，进入 Adaptive Core 规划
- **AI:** 暂不接入
- **Sprint 1:** 已完成
- **Sprint 2:** 已完成
- **最后更新:** 2026-08-30
- **文档同步:** README 与本文件已与 main 实际状态对齐（含 adaptive quest selection 预研说明）

---

# Sprint 1 — Learning Core

状态：✅ Completed

详见 `docs/SPRINT1_LEARNING_CORE.md`。

闭环：

```text
Knowledge → Quest → Evaluation → Evidence → Mastery → Persistence
```

验证：

```text
npm test       ✅
npm run build  ✅
```

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

## Step 状态

| Step | 内容 | 状态 |
|---|---|---|
| 1 | Experience Flow / 状态边界 | ✅ |
| 2 | Quest Experience Flow | ✅ |
| 3 | Failure Recovery | ✅ |
| 4 | XP / Level / Progress | ✅ |
| 5 | Boss Experience | ✅ |
| 6 | Integration + Tests | ✅ |

---

# Sprint 2 Final Summary

状态：✅ Completed

完成内容：

- 完成 Experience Flow
- 完成 Quest Experience Flow
- 完成 Failure Recovery
- 完成 XP / Level / Progress 验证
- 完成 Boss Experience Integration
- 完成完整链路测试验证

最终体验链路：

```text
Quest
 ↓
Evaluation
 ↓
QuestProgress
 ↓
XP
 ↓
Level
 ↓
Learning Evidence
 ↓
Boss Progress
 ↓
Persistence
```

设计原则保持：

- XP 作为唯一经验来源
- Level 为派生数据，不持久化
- QuestProgress 作为游戏进度事实来源
- Learning Evidence 与游戏状态保持独立
- Boss 消费 Progress 状态提供阶段反馈
- Persistence 保持数据一致性

验证：

```text
npm test       ✅
npm run build  ✅
```

---

# Sprint 3 — Adaptive Core（Planning）

状态：🟡 Planning（正式 Step 文档尚未创建）

按 `docs/PROJECT_SPEC.md`，Sprint 3 目标范围：

- Calibration
- Difficulty
- Quest Selection
- Spaced Review

目标：不同玩家开始拥有不同路径。

## 已存在的最小预研（非正式 Step）

Commit：`feat: add adaptive quest selection MVP`

实现位置：

```text
src/application/useCases/getNextQuest.ts
```

行为：

- 返回第一个「未 cleared」且「prerequisiteQuestIds 均已 cleared」的 Quest
- 纯规则、无 scoring / ranking / AI

说明：该实现可作为 Sprint 3 Quest Selection 的起点，但**尚未**纳入正式 Sprint 3 Step、验收标准或 Sprint 文档。规划 Sprint 3 时应先盘点并决定是否吸收、扩展或替换。

## 下一步

1. 创建 `docs/SPRINT3_ADAPTIVE_CORE.md`（或同等命名）并定义正式 Steps
2. 盘点现有 Calibration / getNextQuest / Mastery 与 Adaptive 目标的差距
3. 按「设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 更新 Issue」推进，不扩大 MVP 范围

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
