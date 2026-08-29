# Frontend Quest — Project Progress

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 3 — Adaptive Core
- **当前 Step:** Step 4 — Difficulty Path
- **AI:** 暂不接入
- **Sprint 1:** 已完成
- **Sprint 2:** 已完成
- **最后更新:** 2026-08-30
- **文档同步:** Step 3 selectNextQuest 已实现并有单测

---

# Sprint 1 — Learning Core

状态：✅ Completed — 详见 `docs/SPRINT1_LEARNING_CORE.md`

---

# Sprint 2 — Experience Core

状态：✅ Completed — 详见 `docs/SPRINT2_EXPERIENCE_CORE.md`

---

# Sprint 3 — Adaptive Core

状态：🟡 In Progress

执行计划：`docs/SPRINT3_ADAPTIVE_CORE.md`

## Step 状态

| Step | 内容 | 状态 |
|---|---|---|
| 0 | Planning / Gap Inventory | ✅ |
| 1 | Adaptive 边界 + 数据模型扩展设计 | ✅ |
| 2 | Calibration Content + Persist + 接入 | ✅ |
| 3 | Quest Selection（扩展 getNextQuest） | ✅ |
| 4 | Difficulty Path | 🟡 当前 |
| 5 | Spaced Review 最小模型 | ⬜ |
| 6 | Integration + Tests | ⬜ |

## Step 3 完成摘要

- `selectNextQuest({ quests, progress, calibration })`
- 优先 `calibration.recommendedQuestId`（须为可选题：非 locked/cleared 且 prereq 满足）
- 否则回退为候选列表第一项（与原 `getNextQuest` 一致）
- `getNextQuest` 保留为无 calibration 的薄封装
- 测试：`src/application/useCases/getNextQuest.test.ts`

## 下一步

**Step 4：** Difficulty Path（beginner / intermediate / advanced 与 difficulty 偏好）。

---

# 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
```
