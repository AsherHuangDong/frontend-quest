# Frontend Quest — Project Progress

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 3 — Adaptive Core **Completed**
- **当前阶段:** Sprint 3 已完成，可进入 Sprint 4（Experience Polish）规划
- **AI:** 暂不接入
- **Sprint 1 / 2 / 3:** 已完成
- **最后更新:** 2026-08-30

---

# Sprint 3 — Adaptive Core

状态：✅ Completed

执行计划：`docs/SPRINT3_ADAPTIVE_CORE.md`

| Step | 内容 | 状态 |
|---|---|---|
| 0 | Planning / Gap Inventory | ✅ |
| 1 | Adaptive 边界 + 数据模型扩展设计 | ✅ |
| 2 | Calibration Content + Persist + 接入 | ✅ |
| 3 | Quest Selection | ✅ |
| 4 | Difficulty Path | ✅ |
| 5 | Spaced Review 最小模型 | ✅ |
| 6 | Integration + Tests | ✅ |

## Final 闭环

```text
Calibration → level / recommendedQuestId
        ↓
selectNextQuest
  ├ due review (KnowledgeNode)
  ├ recommendedQuestId
  ├ difficulty path
  └ first candidate
        ↓
Quest → Evaluation → Evidence / Mastery / XP
        ↓
Review schedule (adaptive.review)
        ↓
Persistence
```

验证：

```text
npm test       ✅
npm run build  ✅
```

## 下一步

按 `PROJECT_SPEC`：**Sprint 4 — Experience Polish**（Onboarding、Feedback、Animation、Progress Visualization、Copywriting）。

或先创建 `docs/SPRINT4_EXPERIENCE_POLISH.md` 再开工。

---

# 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
```
