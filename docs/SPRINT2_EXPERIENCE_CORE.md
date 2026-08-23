# Sprint 2 — Experience Core

> Sprint: Sprint 2
> Status: In Progress
> Current Step: Step 4 — XP / Level / Progress
> MVP World: JavaScript Async World
> AI Dependency: None

---

## Sprint Steps

| Step | 内容 | 状态 |
|---|---|---|
| 1 | Experience Flow / 状态边界 | ✅ |
| 2 | Quest Experience Flow | ✅ |
| 3 | Failure Recovery | ✅ |
| 4 | XP / Level / Progress | 🟡 当前 |
| 5 | Boss Experience | ⬜ |
| 6 | Integration + Tests | ⬜ |

---

# Step 3 — Failure Recovery

## 状态

**Completed**

完成内容：

- 复用现有 Quest Result
- 使用 EvaluationResult.feedback 提供失败反馈
- 使用 Quest.hints 提供提示能力
- 保持 retryQuest 恢复流程
- 增加 Failure Recovery 回归测试
- 增加统一 Vitest localStorage 测试环境

验证流程：

```text
Fail
 ↓
Feedback
 ↓
Hint
 ↓
Retry
 ↓
再次挑战
```

保持不变：

- Evaluation
- XP
- Unlock
- Boss
- Chapter
- Learning Core

验证结果：

```text
npm test       ✅
npm run build  ✅
```

---

# Step 4 — XP / Level / Progress

## 当前

下一阶段：设计 XP、Level、Progress 的最小体验闭环。

---

# 开发流程

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
