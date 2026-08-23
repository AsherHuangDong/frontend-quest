# Sprint 2 — Experience Core

> Sprint: Sprint 2
> Status: In Progress
> Current Step: Step 3 — Failure Recovery
> MVP World: JavaScript Async World
> AI Dependency: None

---

## Sprint Steps

| Step | 内容 | 状态 |
|---|---|---|
| 1 | Experience Flow / 状态边界 | ✅ |
| 2 | Quest Experience Flow | ✅ |
| 3 | Failure Recovery | 🟡 当前 |
| 4 | XP / Level / Progress | ⬜ |
| 5 | Boss Experience | ⬜ |
| 6 | Integration + Tests | ⬜ |

---

# Step 2 — Quest Experience Flow

## 状态

**Completed**

完成内容：

- 保持现有 Quest Runtime
- 未引入新的 Quest 状态机
- 明确 Runtime 行为边界
- 增加 Quest Experience Flow 回归测试

验证流程：

```text
AVAILABLE
   ↓
startQuest
   ↓
ANSWER
   ↓
submitAnswer
   ↓
RESULT
   ↓
retry / exit
```

已验证：

- locked Quest 不可启动
- available Quest 可启动
- 未选择答案不能提交
- Result 后不可修改答案
- Retry 恢复答题状态
- Exit 清理 Runtime

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

# Step 3 — Failure Recovery

## 当前

开始设计与实现。

目标：

```text
Fail
 ↓
Feedback
 ↓
Hint / Explanation
 ↓
Retry
 ↓
再次挑战
```

约束：

- 不接入 AI
- 不新增 Recovery Engine
- 不新增复杂状态机
- 优先复用现有 Quest Result

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
