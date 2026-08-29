# Sprint 3 — Adaptive Core

> Status: In Progress  
> Current Step: Step 5 — Spaced Review 最小模型  
> AI Dependency: None

## Step 状态

| Step | 内容 | 状态 |
|---|---|---|
| 0–1 | Planning + 数据模型设计 | ✅ |
| 2 | Calibration Content + Persist | ✅ |
| 3 | Quest Selection | ✅ |
| 4 | Difficulty Path | ✅ |
| 5 | Spaced Review 最小模型 | 🟡 当前 |
| 6 | Integration + Tests | ⬜ |

---

## Step 4 — Difficulty Path（已完成）

```text
src/application/useCases/getNextQuest.ts  // preferByDifficultyPath
```

| Level | 偏好 |
|---|---|
| beginner | difficulty ≤ 2 |
| intermediate | 2 ≤ difficulty ≤ 4 |
| advanced | difficulty ≥ 3；无匹配则回退全候选 |

Selection 顺序：

1. `recommendedQuestId`（候选内）
2. difficulty path 过滤后的第一项
3. 全候选第一项

---

## Step 5 — Spaced Review（下一步）

- Domain：`src/domain/review/*`
- 粒度：KnowledgeNode
- 间隔：1 → 3 → 7 → 14 → 30（天）
- `isDue` / `scheduleNext` 纯函数
- Save：`adaptive.review`
- Selection 可在后续把 due 复习提到优先级 1（本 Step 至少落地模型 + 测试）

---

## 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
```
