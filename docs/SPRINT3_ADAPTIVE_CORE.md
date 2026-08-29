# Sprint 3 — Adaptive Core

> Sprint: Sprint 3  
> Status: In Progress  
> Current Step: Step 3 — Quest Selection  
> MVP World: JavaScript Async World  
> AI Dependency: None

---

## 1. Sprint Goal

让不同玩家在同一 Async World 中开始走**不同路径**。

```text
Player Model (Calibration + Mastery + Progress)
        ↓
Quest Selection
        ↓
Challenge
        ↓
Evaluation → Evidence → Mastery
        ↓
Spaced Review 信号（最小）
```

---

## 2. Step 状态

| Step | 内容 | 状态 |
|---|---|---|
| 0 | Planning / Gap Inventory | ✅ |
| 1 | Adaptive 边界 + 数据模型扩展设计 | ✅ |
| 2 | Calibration Content + Persist + 接入 | ✅ |
| 3 | Quest Selection（扩展 getNextQuest） | 🟡 当前 |
| 4 | Difficulty Path | ⬜ |
| 5 | Spaced Review 最小模型 | ⬜ |
| 6 | Integration + Tests | ⬜ |

---

## Step 1 — 设计结论（已锁定）

### GameSave.adaptive

```ts
adaptive?: {
  calibration: CalibrationResult | null
  review: ReviewStateMap  // KnowledgeNode 粒度；Step 5 填规则
}
```

- 不升 `version`
- 缺省：`{ calibration: null, review: {} }`

### Review 粒度

**KnowledgeNode**；间隔 1 / 3 / 7 / 14 / 30 天。

### Selection 优先级（Step 3+）

1. Review due  
2. `calibration.recommendedQuestId`（仍可开）  
3. Difficulty path（按 level）  
4. 薄弱 Skill  
5. 回退：原 getNextQuest 行为  

只在 prereq 满足的候选中选择；不直接改 Unlock 图。

### 明确不改

Evaluation / XP 公式 / Unlock 核心 / Boss 状态机 / AI

---

## Step 2 — Calibration 接入（已完成）

实现：

```text
src/content/calibration/asyncWorld.ts
src/content/calibration/asyncWorld.test.ts
src/application/useCases/completeCalibration.ts
src/application/useCases/completeCalibration.test.ts
src/infrastructure/persistence/gameRepository.ts  // adaptive + normalize
src/application/gameStore.ts                      // finishCalibration
```

行为：

- Definition questIds：`promise-basics` → `event-loop` → `async-await-final`
- `finishCalibration(answers)` → 写入 `adaptive.calibration` 并 persist
- **不**产生 SkillEvidence，**不**改 XP / QuestProgress
- 旧存档无 adaptive 时自动默认

验证：本地 `npm test` 在集成提交后应全部通过（含恢复的 gameStore 回归）。

---

## Step 3 — Quest Selection（下一步）

- 扩展 `getNextQuest` 为可消费 `calibration` 的 `selectNextQuest`
- 保持纯函数与确定性
- 兼容旧调用（无 calibration 时行为不变）

---

## 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
```
