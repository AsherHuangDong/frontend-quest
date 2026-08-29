# Sprint 5 — Actionable Quest Slice

> Status: Implementation（Step 4 完成）  
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
| 5 | 测试与验收 | ⬜ 下一步 |

## Step 4 交付

- `src/application/useCases/completeAdventure.ts` + 测试
- `gameStore.completeAdventureChapter(chapter)`
- 首次通关：XP + streak + SkillEvidence(understand/apply) + Review
- 重玩：记 attempts / 证据，不重复发 XP
- Hub：异象卡片显示「已修复」
- 不新增存档 version，复用 ProgressMap / learning
