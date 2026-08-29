# Sprint 3 — Adaptive Core

> Sprint: Sprint 3  
> Status: In Progress  
> Current Step: Step 4 — Difficulty Path  
> MVP World: JavaScript Async World  
> AI Dependency: None

---

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

---

## Step 1 — 设计结论（已锁定）

- `GameSave.adaptive`: `{ calibration, review }`，不升 version
- Review 粒度：KnowledgeNode；间隔 1/3/7/14/30
- Selection 优先级：Review due → recommendedQuestId → Difficulty path → 薄弱 Skill → 回退

---

## Step 2 — Calibration（已完成）

- Content：`asyncWorldCalibration`（promise-basics → event-loop → async-await-final）
- `finishCalibration` 仅写 `adaptive.calibration`
- 不产生 Evidence / XP / Progress 变更

---

## Step 3 — Quest Selection（已完成）

实现：

```text
src/application/useCases/getNextQuest.ts
src/application/useCases/getNextQuest.test.ts
```

规则：

1. 候选 = 非 cleared、非 locked、prerequisiteQuestIds 均已 cleared
2. 若 `calibration.recommendedQuestId` 落在候选中 → 返回该 Quest
3. 否则返回候选中按 `quests` 数组顺序的第一项
4. `getNextQuest(quests, progress)` ≡ `selectNextQuest` 无 calibration

未做（留给后续 Step）：

- Review due 优先
- Difficulty path 排序/过滤
- 薄弱 Skill 优先

---

## Step 4 — Difficulty Path（下一步）

| Level | 偏好 |
|---|---|
| beginner | 优先 difficulty ≤ 2 |
| intermediate | 优先 2–4 |
| advanced | 可跳过 difficulty ≤ 2（仍有候选时）；避免死锁则回退 |

接入点：在 `selectNextQuest` 优先级 3 实现，仍只在候选集内选择。

---

## 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
```
