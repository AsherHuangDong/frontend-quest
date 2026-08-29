# Frontend Quest — Project Progress

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 3 — Adaptive Core
- **当前 Step:** Step 5 — Spaced Review 最小模型
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
| 3 | Quest Selection（扩展 getNextQuest） | ✅ |
| 4 | Difficulty Path | ✅ |
| 5 | Spaced Review 最小模型 | 🟡 当前 |
| 6 | Integration + Tests | ⬜ |

## Step 4 完成摘要

- `preferByDifficultyPath(candidates, level)`
  - beginner：difficulty ≤ 2
  - intermediate：2–4
  - advanced：≥ 3（否则回退全候选，避免死锁）
- `selectNextQuest`：recommended → difficulty path → 首个候选
- 测试覆盖 path 与 advanced 跳过低难度

## 下一步

**Step 5：** Spaced Review 最小模型（KnowledgeNode 粒度，间隔 1/3/7/14/30）。

---

# 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
```
