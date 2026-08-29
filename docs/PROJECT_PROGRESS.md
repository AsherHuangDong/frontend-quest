# Frontend Quest — Project Progress

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 3 — Adaptive Core
- **当前 Step:** Step 6 — Integration + Tests
- **AI:** 暂不接入
- **Sprint 1 / 2:** 已完成
- **最后更新:** 2026-08-30

---

# Sprint 3 — Adaptive Core

状态：🟡 In Progress — `docs/SPRINT3_ADAPTIVE_CORE.md`

| Step | 内容 | 状态 |
|---|---|---|
| 0 | Planning / Gap Inventory | ✅ |
| 1 | Adaptive 边界 + 数据模型扩展设计 | ✅ |
| 2 | Calibration Content + Persist + 接入 | ✅ |
| 3 | Quest Selection | ✅ |
| 4 | Difficulty Path | ✅ |
| 5 | Spaced Review 最小模型 | ✅ |
| 6 | Integration + Tests | 🟡 当前 |

## Step 5 完成摘要

- Domain：`src/domain/review/*`（间隔 1/3/7/14/30，isDue / scheduleNext / applyQuestOutcomeToReview）
- Save：`adaptive.review` 使用 Domain `ReviewStateMap`
- Selection：due KnowledgeNode 覆盖的 Quest 优先（含 cleared 复习）
- Store：`submitAnswer` 更新 review；`startQuest` 允许 cleared 复习

## 下一步

**Step 6：** Integration + Tests（端到端回归、文档收尾、可选 GitHub Issue）。

---

# 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
```
