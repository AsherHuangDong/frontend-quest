# Sprint 3 — Adaptive Core

> Sprint: Sprint 3  
> Status: Planning  
> Current Step: Step 0 — Planning / Gap Inventory (本文件)  
> MVP World: JavaScript Async World  
> AI Dependency: None

---

## 1. Sprint Goal

让不同玩家在同一 Async World 中开始走**不同路径**，而不是永远按固定主线推进。

目标闭环：

```text
Player Model (Calibration + Mastery + Progress)
        ↓
Quest Selection
        ↓
Challenge (合适难度)
        ↓
Evaluation → Evidence → Mastery
        ↓
Spaced Review 信号（最小）
```

核心原则：

- 确定性规则，不依赖 AI
- 优先复用现有 Domain / UseCase，不大重构
- 不修改现有 Evaluation / XP / Unlock / Boss 核心规则（除非接入点必须）
- Content 与 Player Progress 继续分离
- Domain 不依赖 React

---

## 2. 与现有实现的差距（盘点）

| 能力 | 现状 | 缺口 |
|---|---|---|
| Calibration 规则 | `src/domain/calibration/*` 已有纯函数与类型 | **未接入** GameStore / GameSave / UI / Content 定义 |
| Quest Selection | `getNextQuest`：首个未 cleared 且 prereq 已 cleared | 未使用 Mastery / Calibration / difficulty |
| Difficulty | Quest 上有 `difficulty: 1..5` | 无路径策略、无玩家难度偏好 |
| Mastery | Evidence → 简单平均 Mastery | 选题未消费 Mastery |
| Spaced Review | 无 | 无 due / interval / review 状态 |
| GameSave | player / progress / learning / gameplay | 无 calibration 结果、无 review 状态 |

已有可吸收预研：

```text
src/application/useCases/getNextQuest.ts
```

行为：规则型、无 scoring / ranking / AI。可作为 Step 3 的基线扩展，而不是推倒重写。

---

## 3. Sprint Scope

**做：**

- Calibration 内容定义 + 结果持久化 + 与选题衔接
- 基于 Progress + Calibration +（可选）Mastery 的确定性选题
- 最小 Difficulty 路径（beginner / intermediate / advanced → 起点与偏好）
- 最小 Spaced Review 模型（间隔表 + due 判断，不做 Memory Raid UI 大工程）
- 集成测试与回归

**明确不做：**

- AI / IRT / Bayesian Mastery
- 复杂推荐算法、多目标排序引擎
- 图数据库
- Player Goal / Player Energy UI（可留接口，本 Sprint 不强制产品化）
- 新知识世界（React / TS 等）
- 修改 Evaluation 判题逻辑、XP 公式、Boss 状态机核心规则
- 完整 Memory Raid 体验与复杂回归剧情

---

## 4. Sprint Steps

| Step | 内容 | 状态 |
|---|---|---|
| 0 | Planning / Gap Inventory（本文件） | ✅ |
| 1 | Adaptive 边界 + 数据模型扩展设计 | ⬜ 当前 |
| 2 | Calibration Content + Persist + 接入 | ⬜ |
| 3 | Quest Selection（扩展 getNextQuest） | ⬜ |
| 4 | Difficulty Path（与 Calibration level 对齐） | ⬜ |
| 5 | Spaced Review 最小模型 | ⬜ |
| 6 | Integration + Tests | ⬜ |

每步仍遵循：

```text
设计 → 实现 → 测试 → 用户验证 → Commit
  → 更新 PROJECT_PROGRESS.md
  → 更新本 Sprint 文档
  → 更新 GitHub Issue（若已创建）
  → 进入下一 Step
```

---

## 5. Step 设计要点（预览，实现前再确认）

### Step 1 — 边界与数据模型

建议最小扩展（最终字段以 Step 1 设计结论为准）：

```text
GameSave
  learning: 现有 skillEvidence / skillMastery
  adaptive?: {
    calibration?: CalibrationResult
    review?: ReviewStateMap   // knowledgeNodeId → nextDueAt, intervalIndex
  }
```

约束：

- 旧存档缺字段时安全默认（与现有 learning 迁移风格一致）
- 不升 `version`，除非必须

### Step 2 — Calibration

- Content：`CalibrationDefinition`（Async World 少量 questIds）
- 跑完后写入 `CalibrationResult`（level / score / recommendedQuestId）
- Calibration **不**产生 SkillEvidence（与 Sprint 1 约定一致）
- 不强制改 Unlock 主线；推荐起点通过 Selection 消费

### Step 3 — Quest Selection

在 `getNextQuest` 上扩展输入，保持纯函数：

```text
候选 = 未 cleared 且 prerequisiteQuestIds 满足
过滤 / 排序（确定性）：
  1. Calibration recommendedQuestId 优先（若仍可用）
  2. 否则按 difficulty 与 level 偏好
  3. 可选：薄弱 skillDimension 相关 quest 优先
  4. 回退：原「第一个满足 prereq」行为
```

禁止：随机性（或仅允许可种子化且测试可控的随机）、AI、黑盒分。

### Step 4 — Difficulty Path

- `beginner` → 偏好低 difficulty / explore·understand
- `intermediate` → 中段
- `advanced` → 可跳过过低 difficulty 的基础题（仍尊重 prereq，避免锁死）

### Step 5 — Spaced Review（最小）

间隔（与 SPEC 对齐）：

```text
1 → 3 → 7 → 14 → 30（天）
```

- 以 KnowledgeNode 或 Quest 为粒度（Step 1 选定其一，优先 KnowledgeNode）
- 提供 `isDue(now)` / `scheduleNext(pass)` 纯函数
- Selection 可在「有 due 复习」时优先返回复习项；无 UI 大改时可先 API + 测试

### Step 6 — Integration + Tests

- Domain 单测：calibration 接入点、selection 规则、review 间隔
- Store / Repository：存档迁移、reload
- 回归：`npm test` / `npm run build`
- 不破坏现有主线通关与 Learning Evidence

---

## 6. Sprint Exit Criteria

完成后系统应能回答：

```text
玩家是否完成过 Calibration？水平如何？
        ↓
下一步推荐哪一个 Quest？依据是什么（规则可解释）？
        ↓
是否有知识节点到期需要复习？
```

并且：

- 无 AI 依赖
- 现有游戏闭环与 Learning Core 仍正常
- 规则可测试、可解释
- 文档与代码一致

---

## 7. 下一步行动

**立即执行：Step 1 — Adaptive 边界 + 数据模型扩展设计**

交付物（仅设计，先不写业务代码，除非用户确认后进入实现）：

1. GameSave / adaptive 字段最终形状
2. Selection 函数签名与优先级表
3. Review 粒度选择与理由
4. 明确不改动的模块列表
5. Step 1 验收标准

---

## 8. 开发流程提醒

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
