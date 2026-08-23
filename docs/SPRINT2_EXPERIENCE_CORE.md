# Sprint 2 — Experience Core

> Sprint: Sprint 2
> Status: In Progress
> Current Step: Step 5 — Boss Experience
> MVP World: JavaScript Async World
> AI Dependency: None

---

## Sprint Steps

| Step | 内容 | 状态 |
|---|---|---|
| 1 | Experience Flow / 状态边界 | ✅ |
| 2 | Quest Experience Flow | ✅ |
| 3 | Failure Recovery | ✅ |
| 4 | XP / Level / Progress | ✅ |
| 5 | Boss Experience | 🟡 当前 |
| 6 | Integration + Tests | ⬜ |

---

# Step 4 — XP / Level / Progress

## 状态

**Completed**

完成内容：

- 验证 Quest Clear 后 XP 增长流程
- 验证失败不会增加 XP
- 验证已完成 Quest 不重复领取 XP
- 验证 XP → Level 派生逻辑
- 验证 Chapter Progression
- 保持 Player.xp 作为唯一经验来源
- 保持 Level 为派生值

验证流程：

```text
Quest Clear
 ↓
QuestProgress
 ↓
XP
 ↓
Level
 ↓
Chapter Progression
```

保持不变：

- Evaluation
- XP Reward
- Unlock
- Boss
- Learning Core

验证结果：

```text
npm test       ✅
npm run build  ✅
```

---

# Step 5 — Boss Experience

## 当前

下一阶段：设计 Boss Experience 的最小体验闭环。

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
