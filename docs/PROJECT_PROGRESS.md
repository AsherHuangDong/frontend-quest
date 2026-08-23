# Frontend Quest — Project Progress

## 当前状态

- **MVP:** Async World
- **当前 Sprint:** Sprint 2 — Experience Core
- **当前阶段:** Step 3 — Failure Recovery
- **AI:** 暂不接入
- **Sprint 1:** 已完成
- **Step 1:** 已完成
- **Step 2:** 已完成
- **最后更新:** 2026-08-24

---

# Sprint 2 — Experience Core

## Sprint Goal

让现有 Quest Runtime 从“能够完成 Quest”进一步形成完整、可持续的游戏体验：

```text
Quest
 ↓
Evaluation
 ↓
Success / Failure
 ↓
XP / Progress / Recovery
 ↓
Unlock / Level / Boss
 ↓
继续挑战
```

## Step 状态

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

状态：✅ Completed

完成内容：

- 保持现有 Quest Runtime 结构
- 未引入新的 Quest 状态机
- 明确 Runtime 行为边界
- 增加 Quest Experience Flow 回归测试

验证范围：

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
- Result 存在后不能修改答案
- Retry 清理答题状态
- Exit 清理 Runtime

保持不变：

- Quest Evaluation
- XP 规则
- Unlock 规则
- Boss 规则
- Chapter 规则
- Learning Core

用户验证：

```text
npm test       ✅
npm run build  ✅
```

---

# 当前 Step 3 — Failure Recovery

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

## 开发流程

每完成一个明确 Step / 功能，必须执行：

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
