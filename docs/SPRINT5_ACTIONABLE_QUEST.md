# Sprint 5 — Actionable Quest Slice

> Status: **P0 Implemented**（工程验收通过，待体验 H1）  
> Concept: **Learning Adventure**  
> Story tone: **B · 轻奇幻** — 异步之城 · 时间裂缝  
> Goal: 验证「行动 → 可见结果」是否比点选项更让人愿意继续（H1）  
> AI / 完整 IDE: 不做

---

## 实现步骤

| Step | 内容 | 状态 |
|---|---|---|
| 0 | 锁定 A/B 交互 + 文案定稿 | ✅ |
| 1 | Adventure 关 content + 判定 | ✅ |
| 2 | Lab UI | ✅ |
| 3 | Hub 城相入口 | ✅ |
| 4 | 进度/证据接线 | ✅ |
| 5 | 测试与工程验收 | ✅ |

## 已锁定

1. Tone B ✅  
2. 第 1 章样板关 ✅  
3. 交互 A 排序 ✅  
4. 训练室暂藏 ✅  

## 交付清单

### Domain / Content
- `src/domain/adventure/types.ts`
- `src/domain/adventure/evaluate.ts`
- `src/content/adventures/chapter1.ts` + `chapter1.test.ts`

### Application
- `src/application/useCases/completeAdventure.ts` + 测试
- `gameStore.completeAdventureChapter`

### Presentation
- `src/presentation/components/adventure/AdventureLab.tsx`
- Hub：异象为先、去题库化、已修复状态

## 工程验收（2026-08-30）

| 项 | 结果 |
|---|---|
| `npm test` | **110 / 110 passed** |
| `npm run build` | **通过** |
| 旧存档 | 不升级 version，兼容 |

### 功能验收清单（手动）

- [ ] Hub 以「当前异象」为主入口，无题库列表
- [ ] 入章 → 排序 → Run → 状态面板变化
- [ ] 错误顺序可重试；正确顺序出现法则铭刻
- [ ] 首通：XP 增加、Hub 显示「已修复」
- [ ] 刷新后进度/法则仍在
- [ ] 重玩不重复发 XP

### 体验验收（H1）

> 玩完第 1 章后，是否比连做 3 道旧选择题 **更想进入下一章**。

- [ ] 更想续章
- [ ] 能说出修的是「契约链顺序」
- [ ] 不像试卷

## 不做（本 Sprint）

- 全卷多章、真地图、音效、IDE、AI
- 推翻 Sprint 1–4 模型
