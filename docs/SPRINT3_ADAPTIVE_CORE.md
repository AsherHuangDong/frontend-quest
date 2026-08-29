# Sprint 3 — Adaptive Core

> Status: In Progress  
> Current Step: Step 6 — Integration + Tests  
> AI Dependency: None

## Step 状态

| Step | 内容 | 状态 |
|---|---|---|
| 0–4 | Planning → Difficulty Path | ✅ |
| 5 | Spaced Review 最小模型 | ✅ |
| 6 | Integration + Tests | 🟡 当前 |

---

## Step 5 — Spaced Review（已完成）

```text
src/domain/review/types.ts
src/domain/review/review.ts
src/domain/review/review.test.ts
```

- 粒度：KnowledgeNode
- 间隔：1 → 3 → 7 → 14 → 30 天
- 首次 pass：`scheduleInitial`
- due 后 pass：`scheduleNext`；fail：`scheduleAfterFailure`
- `selectNextQuest` 优先级 1：覆盖 due 节点的 Quest（可 cleared 复习）
- `gameStore.submitAnswer` 写入 `adaptive.review`

---

## Selection 总优先级

1. Due review（KnowledgeNode）
2. `calibration.recommendedQuestId`
3. Difficulty path（level）
4. 候选列表第一项

---

## Step 6 — Integration + Tests（下一步）

- 补齐端到端 / 回归测试边界
- 确认 `npm test` + `npm run build`
- 更新 README / PROGRESS 为 Sprint 3 收尾状态
- 可选：创建或更新 GitHub Issue

---

## 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
```
