# Frontend Quest — 需求设计与当前状态总览

> 更新日期：2026-08-30  
> 用途：一页看清「要做成什么」和「现在做到哪」  
> 权威细节仍以 `PROJECT_SPEC.md` / 各 Sprint 文档为准

---

## 1. 项目定位

**Frontend Quest** 不是传统题库，也不是简单「刷题 + XP」。

核心定位：

> 通过探索、挑战、失败、反馈、突破和复习，把前端知识练成**可迁移的真实能力**。

当前落地形态：单机 Web 应用，本地存档（localStorage），主题世界 **Async World**（异步 / Promise / Event Loop 等）。

---

## 2. 需求与设计要点

### 2.1 产品理念（摘要）

| 理念 | 含义 |
|---|---|
| 学习不是背答案 | 要能判断、应用、调试 |
| 失败不是惩罚 | 失败用来定位盲区，鼓励重试 |
| 游戏不是贴 XP | 机制服务学习路径，不是装饰 |
| 同一世界，不同路径 | 定级 / 推荐 / 难度路径因人而异 |
| Progress over Pressure | 看见成长，而不是焦虑 |
| Autonomy over Obligation | 可跳过定级，可自选任务 |

### 2.2 核心模型

```text
World（世界）
  └── KnowledgeNode（知识点）+ prerequisite
        └── Quest（挑战）→ 判题 → XP / 解锁 / 证据
              └── Review（间隔复习）
Calibration（定级）→ 推荐起点
SkillMastery（能力掌握，基于证据）
```

- **Quest**：最小训练单位（选择题 / 输出题为主；代码题预留未开放）
- **Knowledge**：内容与玩家进度分离
- **Adaptive**：定级 + 复习到期优先 + 难度路径 + 回退
- **Domain 不依赖 React**；判题与 XP 规则保持确定性

### 2.3 MVP 验证假设

| 假设 | 含义 |
|---|---|
| **H1 愿意继续** | 打完还想点下一题，而不是关掉 |
| **H2 感觉变强** | 能感到进度 / 能力在积累 |
| **H3 愿意回来** | 隔一段时间还想回来（回归 / 复习） |

MVP 成功标准：**不是功能多**，而是 H1（以及逐步 H2/H3）成立。

### 2.4 MVP 范围（Async World）

**做：**

- 异步相关知识点与一组 Quest
- 判题、提示、重试、XP、等级、解锁
- 定级（可选）、下一题推荐、复习 due
- 能力证据 / Mastery 展示
- 本地存档、失败与回归文案体验

**明确不做（当前阶段）：**

- AI 出题 / 讲解 / 面试官
- 账号与云同步
- 图数据库 / 复杂 Graph Engine
- 多 World 大规模扩展
- 完整代码沙箱判题（代码题暂不可提交）

---

## 3. 已完成的开发阶段

| 阶段 | 目标 | 状态 |
|---|---|---|
| Sprint 1 Learning Core | Quest / Knowledge / Progress / 内容 | ✅ |
| Sprint 2 Experience Core | 游玩循环、XP、提示、连胜等体验骨架 | ✅ |
| Sprint 3 Adaptive Core | 定级、选下一题、难度路径、间隔复习 | ✅ |
| MVP P0 可玩闭环 | Hub + 定级 + 挑战 + 存档接到 UI | ✅ |
| Sprint 4 Experience Polish | 文案、进度可视化、回归、动效、测试脚本 | ✅ |

### 3.1 工程上已具备的能力

| 模块 | 现状 |
|---|---|
| 大厅 Hub | 三步引导、下一题 CTA、任务列表、进度条 |
| 定级 | 3 题，不发 XP，只影响推荐 |
| 挑战 | 选择/输出题、提示、重试、教练语气反馈 |
| 进度 | XP、等级进度、通关比例、Mastery 中文标签 |
| 自适应 | `selectNextQuest`：复习 → 定级推荐 → 难度路径 → 回退 |
| 复习 | KnowledgeNode 间隔；due 横幅 |
| 回归 | `lastActiveAt`，离开 ≥12h「欢迎回来」 |
| 存档 | localStorage，兼容旧存档 |
| 测试 | 自动化测试约 100+，构建通过 |

### 3.2 关键代码位置（便于对照）

```text
src/domain/          纯领域：quest / knowledge / progress / review / calibration / skill ...
src/content/         Async World 内容：quests / knowledge / calibration / bosses
src/application/     useCases + gameStoreV2
src/presentation/    体验文案、结果文案、UI 组件
src/App.tsx          大厅 / 定级 / 挑战主界面
docs/                SPEC、各 Sprint、体验测试脚本
```

---

## 4. 当前状态（一句话）

> **Async World MVP 已可本地完整体验；产品验证（H1）尚未跑完；Sprint 5 未立项。**

| 维度 | 状态 |
|---|---|
| 可玩闭环 | ✅ 已完成 |
| 体验打磨 | ✅ Sprint 4 完成 |
| 体验验证 H1 | 🟡 脚本已写，待用户实测 |
| Sprint 5 | ⬜ 未定义，等测试结论 |

**当前焦点文档：** `docs/EXPERIENCE_TEST_SCRIPT.md`

---

## 5. 与「完成」的距离

| 问题 | 答案 |
|---|---|
| 能不能打开自己玩？ | 能（`npm run dev`） |
| 工程 MVP 是否交付？ | 是（P0 闭环 + Sprint 1–4） |
| 是否已验证「愿意继续」？ | 否，需跑体验脚本 |
| 是否该大规模加内容/账号/AI？ | 否，先验证再扩展 |

---

## 6. 建议的后续规划路径

```text
① 体验测试（场景 A–E）
      ↓
② 按「最想关掉的一刻」做 P0/P1 小修
      ↓
③ 立项 Sprint 5（只选一个主目标）
      ↓
④ 内容扩展 / Boss UI / 其他（验证通过后再排）
```

Sprint 5 **候选**（均未批准）：

- Retention Fix（继续服务 H1）
- 内容扩展（题与知识点）
- Boss / 章节仪式感 UI
- 账号（通常更靠后）

---

## 7. 关键文档索引

| 文档 | 内容 |
|---|---|
| `docs/PROJECT_SPEC.md` | 完整产品规格 |
| `docs/PROJECT_PROGRESS.md` | 进度与下一步 |
| `docs/SPRINT1_LEARNING_CORE.md` 等 | 各 Sprint 细节 |
| `docs/SPRINT3_ADAPTIVE_CORE.md` | 自适应与存档形态 |
| `docs/SPRINT4_EXPERIENCE_POLISH.md` | 体验打磨交付 |
| `docs/EXPERIENCE_TEST_SCRIPT.md` | 第一轮体验测试脚本 |
| `docs/ARCHITECTURE_BOUNDARY.md` | 架构边界 |
| 本文 `docs/STATUS_OVERVIEW.md` | 需求 + 状态总览 |

---

## 8. 本地快速体验

```bash
npm install
npm run dev
npm test
```

清档：

```js
localStorage.removeItem('frontend-quest:save');
location.reload();
```
