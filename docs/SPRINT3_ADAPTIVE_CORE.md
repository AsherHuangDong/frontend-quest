# Sprint 3 — Adaptive Core

> Status: **Completed**  
> Follow-up: MVP P0 体验接线已完成（2026-08-30），见 `PROJECT_PROGRESS.md`  
> AI Dependency: None

## Step 状态

| Step | 内容 | 状态 |
|---|---|---|
| 0–6 | Planning → Integration | ✅ |

## 规则层闭环

```text
Calibration → selectNextQuest (review / recommendation / difficulty)
  → Quest → Evaluation → Evidence / Mastery / Review → Persist
```

## 体验层接线（P0，Sprint 3 后补齐）

- `gameStoreV2` 接入 adaptive / learning / review / finishCalibration
- `App.tsx` 大厅：定级、下一题、任务列表、复习 due、Mastery
- 用户自测通过

## 下一阶段

`docs/SPRINT4_EXPERIENCE_POLISH.md`
