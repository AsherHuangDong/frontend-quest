# Frontend Quest — Project Progress

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 3 — Adaptive Core
- **当前 Step:** Step 1 — Adaptive 边界 + 数据模型扩展设计
- **AI:** 暂不接入
- **Sprint 1:** 已完成
- **Sprint 2:** 已完成
- **最后更新:** 2026-08-30
- **文档同步:** 已创建 `docs/SPRINT3_ADAPTIVE_CORE.md`；README / PROGRESS 已指向该文档

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

状态：✅ Completed

详见 `docs/SPRINT2_EXPERIENCE_CORE.md`。

最终体验链路：

```text
Quest → Evaluation → QuestProgress → XP → Level → Learning Evidence → Boss Progress → Persistence
```

验证：

```text
npm test       ✅
npm run build  ✅
```

---

# Sprint 3 — Adaptive Core

状态：🟡 In Progress

执行计划：`docs/SPRINT3_ADAPTIVE_CORE.md`

目标：不同玩家开始拥有不同路径（Calibration / Difficulty / Quest Selection / Spaced Review）。

## Step 状态

| Step | 内容 | 状态 |
|---|---|---|
| 0 | Planning / Gap Inventory | ✅ |
| 1 | Adaptive 边界 + 数据模型扩展设计 | 🟡 当前 |
| 2 | Calibration Content + Persist + 接入 | ⬜ |
| 3 | Quest Selection（扩展 getNextQuest） | ⬜ |
| 4 | Difficulty Path | ⬜ |
| 5 | Spaced Review 最小模型 | ⬜ |
| 6 | Integration + Tests | ⬜ |

## 已存在的最小预研

```text
src/application/useCases/getNextQuest.ts
```

- 规则型：首个未 cleared 且 prereq 已 cleared
- 将在 Step 3 吸收并扩展，不推倒重写

## 关键摘要（Step 0）

- Calibration Domain 纯函数已有，**未接入** Store / Save / Content / UI
- Selection 未消费 Mastery / Calibration / difficulty
- 无 Spaced Review
- GameSave 无 adaptive 字段

## 下一步

**Step 1：** 完成 Adaptive 边界与数据模型扩展设计（先设计、确认后再实现）。

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
