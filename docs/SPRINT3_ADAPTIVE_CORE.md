# Sprint 3 — Adaptive Core

> Status: **Completed**  
> Current Step: Step 6 — Integration + Tests (completed)  
> MVP World: JavaScript Async World  
> AI Dependency: None

---

## Step 状态

| Step | 内容 | 状态 |
|---|---|---|
| 0 | Planning / Gap Inventory | ✅ |
| 1 | Adaptive 边界 + 数据模型扩展设计 | ✅ |
| 2 | Calibration Content + Persist + 接入 | ✅ |
| 3 | Quest Selection | ✅ |
| 4 | Difficulty Path | ✅ |
| 5 | Spaced Review 最小模型 | ✅ |
| 6 | Integration + Tests | ✅ |

---

## Sprint Goal（已达成）

不同玩家可基于 Calibration / Difficulty / Review 走不同路径；规则确定性、无 AI。

---

## 实现清单

### Calibration

```text
src/content/calibration/asyncWorld.ts
src/application/useCases/completeCalibration.ts
gameStore.finishCalibration → adaptive.calibration
```

### Selection + Difficulty

```text
src/application/useCases/getNextQuest.ts
  selectNextQuest / preferByDifficultyPath / getNextQuest
```

优先级：due review → recommendedQuestId → difficulty path → 首候选

### Spaced Review

```text
src/domain/review/*
间隔：1 / 3 / 7 / 14 / 30 天（KnowledgeNode）
gameStore.submitAnswer → adaptive.review
```

### Persistence

```text
GameSave.adaptive?: { calibration, review }
旧存档 normalize 默认值；不升 version
```

---

## Step 6 — Integration

- gameStore：calibration 持久化 / reload
- gameStore：review 建档 / cleared 重玩 / reload
- selectNextQuest 与 store 状态组合
- 全量 `npm test` + `npm run build`

---

## Exit Criteria

- [x] 可完成 Calibration 并持久化 level / recommendation
- [x] 选题消费 calibration + difficulty + review
- [x] KnowledgeNode 复习调度可测试
- [x] 不破坏 Learning / Experience 闭环
- [x] 无 AI；文档与代码一致

**Sprint 3 — Adaptive Core 已完成。**

下一阶段：`Sprint 4 — Experience Polish`（见 PROJECT_SPEC）。
