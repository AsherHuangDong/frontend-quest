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

**JavaScript Async World**（Promise / Microtask / Event Loop / async-await / Race Condition）

不扩展其他知识领域，不接入 AI。

---

## 当前项目状态

**Sprint 3 — Adaptive Core**  
**当前 Step：Step 4 — Difficulty Path**

详细状态：

1. `docs/PROJECT_SPEC.md`
2. `docs/PROJECT_PROGRESS.md`
3. `docs/SPRINT3_ADAPTIVE_CORE.md`

---

## Sprint 进度摘要

| Sprint | 状态 |
|---|---|
| 1 Learning Core | ✅ |
| 2 Experience Core | ✅ |
| 3 Adaptive Core | 🟡 Step 4 |

Sprint 3 Steps：0–3 ✅；4 Difficulty Path 当前；5 Spaced Review；6 Integration。

---

## 开发规则

```text
设计 → 实现 → 测试 → 用户验证 → Commit
  → 更新 PROJECT_PROGRESS.md
  → 更新当前 Sprint 文档
  → 更新 GitHub Issue
  → 进入下一 Step
```

- 文档与代码必须可互相恢复上下文
- MVP 不依赖 AI；不提前扩大范围

---

## 本地运行

```bash
npm install
npm run dev
npm test
npm run build
```
