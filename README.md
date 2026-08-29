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

**Sprint 3 — Adaptive Core**

当前 Step：**Step 1 — Adaptive 边界 + 数据模型扩展设计**

Sprint 1（Learning Core）与 Sprint 2（Experience Core）均已完成。

详细状态请优先阅读：

1. `docs/PROJECT_SPEC.md` — 产品与架构总纲
2. `docs/PROJECT_PROGRESS.md` — 当前项目状态
3. `docs/SPRINT3_ADAPTIVE_CORE.md` — 当前 Sprint 执行计划
4. `docs/SPRINT1_LEARNING_CORE.md` / `docs/SPRINT2_EXPERIENCE_CORE.md` — 历史 Sprint 完成记录

如果文档与代码不一致，应先修复文档同步问题，不要根据猜测继续开发。

---

## Sprint 1 状态

**Learning Core — 已完成**

```text
Knowledge → Quest → Evaluation → Evidence → Mastery → Persistence
```

```text
npm test       ✅
npm run build  ✅
```

---

## Sprint 2 状态

**Experience Core — 已完成**

| Step | 内容 | 状态 |
|---|---|---|
| 1–6 | Experience Flow → Integration + Tests | ✅ |

```text
npm test       ✅
npm run build  ✅
```

---

## Sprint 3 状态

**Adaptive Core — In Progress**

| Step | 内容 | 状态 |
|---|---|---|
| 0 | Planning / Gap Inventory | ✅ |
| 1 | Adaptive 边界 + 数据模型扩展设计 | 🟡 当前 |
| 2 | Calibration Content + Persist + 接入 | ⬜ |
| 3 | Quest Selection（扩展 getNextQuest） | ⬜ |
| 4 | Difficulty Path | ⬜ |
| 5 | Spaced Review 最小模型 | ⬜ |
| 6 | Integration + Tests | ⬜ |

目标：Calibration、Difficulty、Quest Selection、Spaced Review（确定性规则，无 AI）。

---

## 当前游戏闭环

```text
Chapter → Quest → Answer → Evaluation → Pass/Fail → XP → Unlock → Persistence
```

Learning 与 Experience 已叠加：

```text
Knowledge → Quest → Evaluation
              ├→ Experience (XP / Progress / Recovery / Boss)
              └→ Learning (Evidence / Mastery)
```

---

## 开发规则

```text
设计 → 实现 → 测试 → 用户验证 → Commit
  → 更新 PROJECT_PROGRESS.md
  → 更新当前 Sprint 文档
  → 更新 GitHub Issue
  → 进入下一 Step
```

### 硬性要求

- 每完成一个明确功能，都必须同步更新 MD 文档。
- 不允许只提交代码而不更新项目进度。
- 新对话必须能够通过仓库文档恢复当前项目状态。
- 开发前必须检查实际代码，不能只相信文档。
- 如果文档与代码不一致，必须明确指出并优先修复同步问题。
- 不提前扩大 MVP 范围；MVP 不依赖 AI。
- AI 只能作为可替换 Teaching Layer，不能成为 Truth Layer。

---

## 文档职责

| 文档 | 回答 |
|---|---|
| `docs/PROJECT_SPEC.md` | 为什么做、最终做什么 |
| `docs/PROJECT_PROGRESS.md` | 现在做到哪 |
| `docs/SPRINT3_ADAPTIVE_CORE.md` | 当前 Sprint 怎么做 |

---

## 新对话如何接手项目

```text
PROJECT_SPEC.md → PROJECT_PROGRESS.md → 当前 Sprint 文档 → 实际代码
```

恢复上下文时输出精简状态报告；恢复阶段不要直接写代码或重新设计产品。

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

- UI 不直接承担游戏规则；Domain 不依赖 React
- Store 负责状态协调，不成为业务逻辑垃圾桶
- Content 与 Player Progress 分离；Runtime 与持久化 Save 分离
- Evaluation 使用统一结果模型；LocalStorage 经 Repository 访问
- Core Learning Logic 不依赖 AI；优先最小可验证实验
