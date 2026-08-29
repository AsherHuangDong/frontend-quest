# Sprint 4 — Experience Polish

> Status: Planning  
> Goal: 让玩家愿意继续（H1），并强化「感觉变强 / 愿意回来」的感知  
> Prerequisite: Sprint 1–3 + MVP P0 体验层已完成且用户自测通过  
> AI Dependency: None

---

## 1. 为什么现在做 Polish

规则与主路径已可玩：

```text
定级（可选）→ 下一题 → 答题 → 反馈 → 存档 → 复习 due
```

下一阶段的瓶颈不是再堆引擎，而是：

- 反馈是否让人想点「下一题」
- 成长是否看得见
- 失败是否不伤自尊
- 回来时是否不内疚

对齐 `PROJECT_SPEC` Sprint 4：Onboarding、Feedback、Animation、Interaction、Progress Visualization、Copywriting。

---

## 2. Sprint Goal

> 在不扩大知识范围、不接入 AI 的前提下，把现有闭环打磨成「愿意再来一局」的体验。

成功信号（定性 + 可手工测）：

| 假设 | 可观察行为 |
|---|---|
| H1 愿意继续 | 通关后主动点「下一题」；单次会话 ≥ 3 题 |
| H2 感觉变强 | 能说出 Mastery / Level 变化；Boss 或高难度题有阶段感 |
| H3 愿意回来 | 复习 due 文案清晰；回归无惩罚感 |

---

## 3. 范围

### In Scope

| 主题 | 内容 |
|---|---|
| Feedback | 成功/失败文案、得分、提示节奏；减少「冷冰冰判题」感 |
| Progress Viz | Level/XP 条、章节/任务完成度、Mastery 更可读 |
| Onboarding | 首屏 30 秒内懂「定级 / 下一题 / 复习」 |
| Copywriting | 失败鼓励、解锁、定级结果、复习 due、回归文案 |
| Interaction | 按钮状态、锁定原因、下一题默认焦点 |
| Light motion | 可选：通过/XP 轻反馈（不阻塞、不炫技） |
| Test script | 第一轮正式体验测试清单（3–8 人） |

### Out of Scope

- AI / 自动出题
- 新知识世界
- Player Goal / Energy 完整产品化（可只留文案钩子）
- Achievement 系统大而全
- 真实 Code Runner
- 社交 / 排行榜 / 商业化

---

## 4. 建议 Steps

| Step | 内容 | 验收 |
|---|---|---|
| 0 | 体验问题清单（基于 P0 自测） | 列出 Top 痛点 |
| 1 | Feedback + 失败文案 | 失败不伤自尊；成功想点下一题 |
| 2 | Progress 可视化 | 大厅能一眼看到成长 |
| 3 | Onboarding / 文案统一 | 新用户 30s 内上手 |
| 4 | Review / Return 文案 | due 与回归语气正确 |
| 5 | 交互细节 + 轻动效（可选） | 不卡、不闪、主路径顺 |
| 6 | 体验测试脚本 + 小范围验证 | 记录 H1 行为与反馈 |

每步仍遵循：设计 → 实现 → 测试 → 用户验证 → 文档。

---

## 5. 与现有代码的落点

| 区域 | 文件（参考） |
|---|---|
| 主体验 | `src/App.tsx` |
| Store | `src/application/gameStoreV2.ts` |
| Feedback 组件 | `src/presentation/components/feedback/*` |
| Progress 组件 | `src/presentation/components/progress/*` |
| 样式 | `src/styles.css` |

原则：优先增强现有大厅 / 答题流，避免另起一套路由大重构。

---

## 6. Step 0 待确认问题（开工前）

1. 失败反馈更偏「教练语气」还是「游戏战斗语气」？
2. 进度展示优先 **Level/XP** 还是 **Mastery 维度**？
3. 第一轮外部测试人数与渠道（自己人 / 目标用户）？

默认（若未指定）：教练语气 + Level/XP 为主、Mastery 为辅 + 先内部 3 人再 1–2 目标用户。

---

## 7. Exit Criteria

- [ ] 新用户无需读文档即可完成：定级（或跳过）→ ≥3 题 → 看见进度
- [ ] 失败路径有明确 Hint / Retry，无羞辱感文案
- [ ] 复习 due 与「下一题」在大厅可感知
- [ ] 至少一轮有记录的体验反馈（可内部）
- [ ] `npm test` / `npm run build` 保持通过
- [ ] 文档与行为一致

---

## 8. 开发流程

```text
设计 → 实现 → 测试 → 用户验证 → Commit
  → 更新 PROJECT_PROGRESS.md
  → 更新本文件 Step 状态
  → 下一 Step
```
