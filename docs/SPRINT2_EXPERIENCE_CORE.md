# Sprint 2 — Experience Core

> Sprint: Sprint 2  
> Status: In Progress  
> Current Step: Step 1 — Experience Flow  
> MVP World: JavaScript Async World  
> AI Dependency: None

---

## 1. Sprint Goal

在 Sprint 1 Learning Core 的基础上，让现有 Quest Runtime 形成完整、可持续的游戏体验。

目标闭环：

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

Sprint 2 优先复用现有架构，不进行大规模重构。

---

## 2. Sprint MVP

继续只验证 **JavaScript Async World**。

Sprint 2 不扩展新的 Knowledge Domain，不接入 AI。

最终玩家应能够完成：

```text
选择 Quest
   ↓
挑战
   ↓
成功 / 失败
   ↓
反馈
   ↓
Retry
   ↓
XP / Progress
   ↓
Level / Unlock
   ↓
继续挑战
```

阶段性内容最终可以进入 Boss Experience，并复用现有 Evaluation / Progress / XP / Learning Core。

---

## 3. Sprint Steps

| Step | 内容 | 状态 |
|---|---|---|
| 1 | Experience Flow / 状态边界 | 🟡 当前 |
| 2 | Quest Experience Flow | ⬜ |
| 3 | Failure Recovery | ⬜ |
| 4 | XP / Level / Progress | ⬜ |
| 5 | Boss Experience | ⬜ |
| 6 | Integration + Tests | ⬜ |

---

# Step 1 — Experience Flow / 状态边界

## 状态

**进行中。**

### 实际代码检查结论

当前 `gameStore` 已经提供：

```text
startQuest
selectAnswer
submitAnswer
retryQuest
exitQuest
```

并维护：

```text
player
progress
skillEvidence
skillMastery
currentStreak
bestStreak
runtime
```

当前 `QuestProgress` 已经能够表达：

```text
questId
status
attempts
bestScore
lastScore
clearedAt
```

当前 `Player` 持久化数据只有：

```text
id
name
xp
```

### Step 1 已确认的设计原则

#### 1. Level 是 XP 的派生状态

第一版不把 `level` 作为独立持久化字段：

```text
Player.xp
   ↓
calculateLevel(xp)
   ↓
Level
```

具体 XP / Level 曲线留到 Step 4 确定。

#### 2. Chapter / World Progress 从 QuestProgress 派生

第一版不维护多套独立持久化状态：

```text
QuestProgress
      ↓
Chapter Progress
      ↓
World Progress
```

Step 1 不修改现有 `QuestProgress` 模型。

#### 3. Failure Recovery 复用现有 Result + Retry

当前已有：

```text
submitAnswer()
    ↓
Evaluation Result
    ↓
retryQuest()
```

因此不新增：

- Recovery Engine
- Retry Engine
- RecoveryState
- 新状态机

#### 4. 不新增统一 ExperienceState

继续保持现有状态边界：

```text
GameStore
│
├── player
│     └── xp
│
├── progress
│     └── QuestProgress
│
├── gameplay
│     ├── currentStreak
│     ├── bestStreak
│     └── bossProgress
│
└── learning
      ├── skillEvidence
      └── skillMastery
```

Level、Chapter Progress、World Progress 作为后续派生结果，不把它们全部塞进新的大状态对象。

### Step 1 明确不做

- 不新增 Experience State 大模型
- 不新增 Quest 状态机
- 不重构 GameStore
- 不修改 Evaluation
- 不修改既有 XP 算法
- 不接入 AI
- 不实现 UI
- 不实现 Adaptive
- 不新增 Persistence Schema
- 不新增复杂 Recovery Engine

---

# Step 2 — Quest Experience Flow

目标：明确并完善现有 Quest Runtime 的完整体验边界。

重点：

```text
AVAILABLE
   ↓
ACTIVE
   ↓
ANSWER
   ↓
RESULT
 ┌─┴─┐
PASS FAIL
```

优先复用现有 `gameStore` / `runtime`，只有现有模型无法表达 MVP 行为时才增加最小状态。

---

# Step 3 — Failure Recovery

目标：形成确定性的失败恢复体验：

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

第一版只使用 Quest Content 中已有或补充的确定性 Hint / Explanation，不接入 AI。

---

# Step 4 — XP / Level / Progress

目标：让玩家明显感受到成长。

```text
Quest
 ↓
XP
 ↓
Level
 ↓
Progress
 ↓
Unlock
```

不重新设计已经存在的 XP / Unlock 规则；先复用现有实现，再补齐缺失的 Level / Progress 派生能力。

---

# Step 5 — Boss Experience

目标：让 Async World 具有阶段性综合挑战。

Boss 复用现有 Quest / Evaluation / XP / Progress / Learning Core，不建立第二套 Quest 系统，也不实现复杂 Boss Engine。

第一版只需要表达：

```text
World / Chapter Progress
        ↓
       Boss
        ↓
  综合 Evaluation
        ↓
Progress / XP / Learning
```

---

# Step 6 — Integration + Tests

最终验证：

### Happy Path

```text
Quest
 ↓
Pass
 ↓
XP
 ↓
Unlock
 ↓
Next Quest
```

### Failure Path

```text
Quest
 ↓
Fail
 ↓
Hint / Explanation
 ↓
Retry
 ↓
Pass
```

### Replay

```text
Cleared Quest
 ↓
Replay
 ↓
Learning Evidence 增加
 ↓
Quest XP 不重复奖励
```

### Boss

```text
World Progress
 ↓
Boss
 ↓
Evaluation
 ↓
Progress / XP / Learning
```

最终必须通过：

```text
npm test
npm run build
```

---

# Sprint 2 明确不做

- AI
- Adaptive Quest Selection
- Spaced Review
- 新 Knowledge Domain
- React / TypeScript 学习内容
- 复杂剧情
- Inventory
- Gold
- Equipment
- Gacha
- Leaderboard
- Social
- Multiplayer
- 复杂 Boss Engine
- 复杂状态机
- Learning Analytics Dashboard
- 复杂推荐算法

Adaptive Core 留待后续 Sprint。

---

# 开发规则

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

**没有完成文档同步，就不视为该功能完整完成。**
