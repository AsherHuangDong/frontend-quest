# Frontend Quest

一个把前端面试复习做成 RPG 闯关游戏的项目。

## P0 Vertical Slice

当前已跑通第一条游戏闭环：

```text
Chapter → Quest → Answer → Evaluation → Pass/Fail → XP → Unlock → LocalStorage
```

### 当前内容

- Chapter 01 · JavaScript 基础
- Quest 01 · Promise 到底解决了什么问题？
- Quest 02 · Promise 链式调用（完成 Quest 01 后解锁）

## 本地运行

```bash
npm install
npm run dev
```

## 测试

```bash
npm test
```

## 架构原则

- UI 不直接承担游戏规则
- Domain 不依赖 React
- Store 负责状态协调，不成为业务逻辑垃圾桶
- Content 与 Player Progress 分离
- Runtime 与持久化 Save 分离
- Evaluation 使用统一结果模型，为未来 Code Judge / AI Judge 留出扩展点
- LocalStorage 通过 Repository 接口访问
