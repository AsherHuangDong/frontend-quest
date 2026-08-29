# Frontend Quest

> 把前端知识学习、能力训练与能力考核做成一个可闯关的游戏。

[GitHub Repository](https://github.com/AsherHuangDong/frontend-quest)

## 项目是什么？

Frontend Quest 不是传统题库，也不是简单的“题库 + XP”。

核心目标是让学习过程从：

```text
知识 → 做题 → 得分
```

逐步变成：

```text
探索 → 挑战 → 尝试 → 失败 → 反馈 → 理解 → 再挑战 → 能力形成
```

Quest 是训练和产生能力证据的载体，而不是知识本身。长期目标是形成一个能够训练 Recall、Understand、Apply、Debug、Transfer 等能力的自适应学习系统。

---

## 当前 MVP

当前只验证一个知识世界：

**JavaScript Async World**

覆盖：

- Promise
- Promise State
- Microtask
- Event Loop
- async / await
- Race Condition

暂时不扩展 React、TypeScript、CSS 等其他知识领域，也不接入 AI。

原因很简单：MVP 首先要验证 **Learning Core + Quest + Assessment + Game Experience** 是否成立，而不是验证内容规模。

---

## 当前项目状态

当前处于：

**Sprint 3 Planning**

Sprint 1（Learning Core）与 Sprint 2（Experience Core）均已完成。下一阶段按产品规格进入 Adaptive Core 规划与实施。

详细状态请优先阅读：

1. `docs/PROJECT_SPEC.md` — 产品与架构总纲
2. `docs/PROJECT_PROGRESS.md` — 当前项目状态
3. `docs/SPRINT1_LEARNING_CORE.md` — Sprint 1 完成记录
4. `docs/SPRINT2_EXPERIENCE_CORE.md` — Sprint 2 完成记录

如果文档与代码不一致，应先修复文档同步问题，不要根据猜测继续开发。

---

## Sprint 1 状态

**Learning Core — 已完成**

```text
Knowledge
    ↓
Quest
    ↓
Evaluation
    ↓
Evidence
    ↓
Mastery
    ↓
Persistence
```

用户最终验证通过：

```text
npm test       ✅
npm run build  ✅
```

---

## Sprint 2 状态

**Experience Core — 已完成**

| Step | 内容 | 状态 |
|---|---|---|
| 1 | Experience Flow / 状态边界 | ✅ |
| 2 | Quest Experience Flow | ✅ |
| 3 | Failure Recovery | ✅ |
| 4 | XP / Level / Progress | ✅ |
| 5 | Boss Experience | ✅ |
| 6 | Integration + Tests | ✅ |

最终体验链路：

```text
Quest
 ↓
Evaluation
 ↓
QuestProgress
 ↓
XP
 ↓
Level
 ↓
Learning Evidence
 ↓
Boss Progress
 ↓
Persistence
```

验证：

```text
npm test       ✅
npm run build  ✅
```

---

## Sprint 3 状态

**Adaptive Core — Planning**

目标（来自 `PROJECT_SPEC`）：

- Calibration
- Difficulty
- Quest Selection
- Spaced Review

已有代码中的最小预研（尚未纳入正式 Sprint 3 Step）：

- `src/application/useCases/getNextQuest.ts`：基于 `prerequisiteQuestIds` 的规则型选题 MVP（非 AI、无 ranking）

正式 Step 列表与验收标准在 Sprint 3 文档创建并完成规划后再开始实现。

---

## 当前游戏闭环

```text
Chapter
  ↓
Quest
  ↓
Answer
  ↓
Evaluation
  ↓
Pass / Fail
  ↓
XP
  ↓
Unlock
  ↓
Persistence
```

Learning 与 Experience 已叠加在此闭环之上：

```text
Knowledge
    ↓
Quest
    ↓
Evaluation
    ├──────────────→ Experience
    │                    ├── XP
    │                    ├── Progress
    │                    ├── Recovery
    │                    └── Boss
    │
    └──────────────→ Learning
                         ├── Evidence
                         └── Mastery
```

---

## 开发规则

这是一个长期项目，开发必须遵守以下流程：

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
更新当前 Sprint 文档
 ↓
更新 GitHub Issue
 ↓
进入下一 Step
```

### 硬性要求

- 每完成一个明确功能，都必须同步更新 MD 文档。
- 不允许只提交代码而不更新项目进度。
- 新对话必须能够通过仓库文档恢复当前项目状态。
- 开发前必须检查实际代码，不能只相信文档。
- 如果文档与代码不一致，必须明确指出并优先修复同步问题。
- 不提前扩大 MVP 范围。
- 不为了未来需求提前实现复杂架构。
- MVP 不依赖 AI。
- AI 未来只能作为可替换的 Teaching / Assistance Layer，不能成为核心 Truth Layer。

---

## 文档职责

### `docs/PROJECT_SPEC.md`

回答：**我们为什么做、最终想做什么。**

它是项目的 Product Truth，包括产品定位、愿景、MVP、长期方向、AI 战略和架构原则。

### `docs/PROJECT_PROGRESS.md`

回答：**我们现在做到哪。**

它是项目的 Project State，包括当前 Sprint、当前 Step、已完成内容、进行中内容、阻塞项、下一步和文档同步状态。

### `docs/SPRINT*_*.md`

回答：**某一 Sprint 具体怎么做 / 做了什么。**

它是该 Sprint 的 Execution Plan 与完成记录。当前无进行中的 Sprint 正式文档；Sprint 3 文档待创建。

---

## 新对话如何接手项目

新对话不要重新询问项目背景，也不要根据当前聊天猜测项目状态。

请依次：

```text
PROJECT_SPEC.md
      ↓
“我们是谁、为什么做”

PROJECT_PROGRESS.md
      ↓
“我们现在在哪”

当前 Sprint 文档（若已创建）
      ↓
“当前这一步怎么做”

GitHub 实际代码
      ↓
“实际上做没做”
```

恢复上下文时，只需要输出精简的：

- 项目定位
- 当前 MVP
- 当前 Sprint
- Sprint Step 状态
- 最近完成工作
- 当前 Step
- 下一步
- 实际代码与文档是否一致
- 当前明确不做
- 开发规则

恢复阶段不要直接写代码，也不要重新设计整个产品。

---

## 本地运行

```bash
npm install
npm run dev
```

## 测试

```bash
npm test
npm run build
```

---

## 架构原则

- UI 不直接承担游戏规则
- Domain 不依赖 React
- Store 负责状态协调，不成为业务逻辑垃圾桶
- Content 与 Player Progress 分离
- Runtime 与持久化 Save 分离
- Evaluation 使用统一结果模型，为未来 Code Judge / AI Judge 留出扩展点
- LocalStorage 通过 Repository 接口访问
- Core Learning Logic 不依赖 AI
- AI 是未来可替换的 Teaching Layer，而不是 Truth Layer
- 优先做最小可验证实验，而不是提前实现长期愿景
