# Sprint 5 — Actionable Quest Slice

> Status: Implementation（Step 2 完成）  
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
| 3 | Hub 城相入口 | ⬜ 下一步 |
| 4 | 进度/证据接线 | ⬜ |
| 5 | 测试与验收 | ⬜ |

## 已锁定

1. Tone B ✅  
2. 第 1 章样板关 ✅  
3. 交互 A 排序 ✅  
4. 训练室暂藏 ✅  

## Step 2 交付

- `src/presentation/components/adventure/AdventureLab.tsx`
- 状态机：intro → lab → running → failed ⇄ lab / success
- 状态面板、卡片上下排序、唤起时序（Run）
- Hub 临时入口（待 Step 3 替换）
