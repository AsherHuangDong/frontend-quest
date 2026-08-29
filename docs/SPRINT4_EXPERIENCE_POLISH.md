# Sprint 4 — Experience Polish

> Status: In Progress  
> Current Step: Step 2 — Progress 可视化  
> Goal: 让玩家愿意继续（H1）  
> AI Dependency: None

## Step 状态

| Step | 内容 | 状态 |
|---|---|---|
| 0 | 体验问题清单 | ✅（默认教练语气） |
| 1 | Feedback + 失败文案 | ✅ |
| 2 | Progress 可视化 | 🟡 当前 |
| 3 | Onboarding / 文案统一 | ⬜ |
| 4 | Review / Return 文案 | ⬜ |
| 5 | 交互细节 + 轻动效 | ⬜ |
| 6 | 体验测试脚本 | ⬜ |

---

## Step 1 — Feedback + 失败文案（已完成）

- Domain 判题反馈改为教练语气（不改分数逻辑）
- `buildResultCopy`：成功/失败标题、引导、鼓励语
- 失败主 CTA「再试一次」；成功突出「下一题」+ XP/Level
- 复习横幅：强调「加固记忆」而非进度倒退
- 定级说明：非考试、不发 XP

文件：

```text
src/domain/quest/evaluator.ts
src/presentation/experience/resultCopy.ts
src/App.tsx
src/styles.css
```

---

## Step 2 — Progress 可视化（下一步）

大厅增强：

- XP 进度条（距下一级）
- 任务完成度（已通关 / 总数）
- Mastery 可读标签（中文或友好名）

---

## 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
```
