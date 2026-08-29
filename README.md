# Frontend Quest

> 把前端知识学习、能力训练与能力考核做成一个可闯关的游戏。

[GitHub Repository](https://github.com/AsherHuangDong/frontend-quest)

## 当前 MVP

**JavaScript Async World** — 不扩展其他领域，不接入 AI。

## 项目状态

| 阶段 | 状态 |
|---|---|
| Sprint 1 Learning Core | ✅ |
| Sprint 2 Experience Core | ✅ |
| Sprint 3 Adaptive Core | ✅ |
| MVP P0 体验层（大厅 / 定级 / 下一题 / 复习） | ✅ 用户自测通过 |
| Sprint 4 Experience Polish | 🟡 Planning |

文档：

1. `docs/PROJECT_SPEC.md` — 产品与架构规格
2. `docs/PROJECT_PROGRESS.md` — 当前进度
3. `docs/SPRINT3_ADAPTIVE_CORE.md` — Adaptive 完成记录
4. `docs/SPRINT4_EXPERIENCE_POLISH.md` — 下一阶段规划

## 本地体验

```bash
npm install
npm run dev
```

建议路径：定级（可选）→ 下一题 → 连续挑战 → 查看 Mastery / 刷新验证存档。

```bash
npm test
npm run build
```

若旧存档异常：

```js
localStorage.removeItem('frontend-quest:save')
```

## 开发规则

设计 → 实现 → 测试 → 用户验证 → Commit → 更新文档 → 下一 Step
