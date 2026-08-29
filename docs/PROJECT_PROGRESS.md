# Frontend Quest — Project Progress

## 当前状态

- **MVP:** Async World
- **核心 Sprint：** 1 Learning / 2 Experience / 3 Adaptive — **均已完成**
- **MVP P0 体验层：** 已完成并经用户自测通过（2026-08-30）
- **当前阶段：** Sprint 4 — Experience Polish（规划中）
- **AI：** 暂不接入
- **最后更新:** 2026-08-30

---

## 已完成总览

| 阶段 | 状态 | 说明 |
|---|---|---|
| Sprint 1 Learning Core | ✅ | Knowledge / Quest / Evidence / Mastery / Calibration Domain |
| Sprint 2 Experience Core | ✅ | Quest 流 / XP / Level / Boss / Recovery / 存档 |
| Sprint 3 Adaptive Core | ✅ | Calibration 持久化 / Selection / Difficulty / Review |
| MVP P0 体验接线 | ✅ | 大厅、定级、下一题、复习提示、Mastery 展示 |
| Sprint 4 Experience Polish | 🟡 | 规划见 `docs/SPRINT4_EXPERIENCE_POLISH.md` |

---

## MVP P0 体验层（用户验证）

状态：✅ 用户自测通过

入口：`App.tsx` + `gameStoreV2`（已接入 adaptive / learning / review）

| 能力 | 体验 |
|---|---|
| Onboarding 文案 | 大厅简短说明 |
| Calibration UI | 可选 3 题定级，写入 `adaptive.calibration` |
| 下一题 | `selectNextQuest`（due → recommendation → difficulty） |
| 任务列表 | 锁定 / 挑战 / 复习 |
| 复习 due | 顶部横幅 |
| Mastery | 有证据后展示维度分数 |
| 存档 | XP / 进度 / 校准 / 复习 / Mastery |

本地验证：

```bash
npm install && npm run dev
npm test && npm run build
```

---

## Sprint 3 闭环（规则层）

```text
Calibration → selectNextQuest → Quest → Evaluation
  → Evidence / Mastery / XP / Review → Persist
```

详情：`docs/SPRINT3_ADAPTIVE_CORE.md`

---

## 下一步：Sprint 4 — Experience Polish

目标：让玩家**愿意继续**（对齐 SPEC H1，并服务 H2/H3）。

规划文档：`docs/SPRINT4_EXPERIENCE_POLISH.md`

建议顺序：

1. Feedback 打磨（对错 / XP / 解锁可读性）
2. Progress 可视化增强
3. Failure → Hint → Retry 文案与节奏
4. Return / Review 文案（无罪回归）
5. 轻量动效与交互一致性
6. 小范围体验测试脚本（H1）

明确不做：AI、新知识世界、社交、商业化。

---

# 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit
  → 更新 PROJECT_PROGRESS.md
  → 更新当前 Sprint 文档
  → 进入下一 Step
```
