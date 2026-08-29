# Frontend Quest — Project Progress

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 3 — Adaptive Core
- **当前 Step:** Step 3 — Quest Selection（扩展 getNextQuest）
- **AI:** 暂不接入
- **Sprint 1:** 已完成
- **Sprint 2:** 已完成
- **最后更新:** 2026-08-30
- **文档同步:** Step 1 设计已锁定；Step 2 Calibration Content + Persist 已实现并有测试

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
| 3 | Quest Selection（扩展 getNextQuest） | 🟡 当前 |
| 4 | Difficulty Path | ⬜ |
| 5 | Spaced Review 最小模型 | ⬜ |
| 6 | Integration + Tests | ⬜ |

## Step 2 完成摘要

- Content：`src/content/calibration/asyncWorld.ts`（promise-basics → event-loop → async-await-final）
- UseCase：`completeCalibration`（不产生 Evidence / XP / Progress）
- Save：`GameSave.adaptive`（calibration + review 占位）
- Store：`finishCalibration` + 旧存档默认 `adaptive`
- 测试：content / useCase / repository / gameStore（含回归恢复）

## 下一步

**Step 3：** 扩展 `getNextQuest` → `selectNextQuest`（消费 calibration，保持确定性回退）。

---

# 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit
  → 更新 PROJECT_PROGRESS.md
  → 更新本 Sprint 文档
  → 更新 GitHub Issue
  → 进入下一 Step
```
