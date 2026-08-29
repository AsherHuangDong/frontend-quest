# Frontend Quest

> 把前端知识学习、能力训练与能力考核做成一个可闯关的游戏。

[GitHub Repository](https://github.com/AsherHuangDong/frontend-quest)

## 项目是什么？

Frontend Quest 不是传统题库，也不是简单的“题库 + XP”。核心是把学习变成：探索 → 挑战 → 失败 → 反馈 → 理解 → 再挑战 → 能力形成。

## 当前 MVP

**JavaScript Async World**（Promise / Microtask / Event Loop / async-await / Race Condition）

不扩展其他知识领域，不接入 AI。

## 当前项目状态

**Sprint 3 — Adaptive Core 已完成**

下一阶段：Sprint 4 — Experience Polish（规划中）

| Sprint | 状态 |
|---|---|
| 1 Learning Core | ✅ |
| 2 Experience Core | ✅ |
| 3 Adaptive Core | ✅ |
| 4 Experience Polish | ⬜ Planning |

详细状态：

1. `docs/PROJECT_SPEC.md`
2. `docs/PROJECT_PROGRESS.md`
3. `docs/SPRINT3_ADAPTIVE_CORE.md`（完成记录）

## Adaptive 闭环（Sprint 3）

```text
Calibration → selectNextQuest (review / recommendation / difficulty)
    → Quest → Evaluation → Evidence / Mastery / Review schedule → Persist
```

## 开发规则

设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step

- 新对话通过仓库文档恢复上下文
- 文档与代码不一致时优先修同步
- MVP 不依赖 AI

## 本地运行

```bash
npm install
npm run dev
npm test
npm run build
```
