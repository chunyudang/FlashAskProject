# FlashAsk 项目智能体配置

## 项目上下文

闪问(FlashAsk) 通识知识问答游戏，MVP 版本使用 UniApp + React/ANTD + Koa/SQLite 三端架构。

## 通用指令

1. PRD 文档在 `docs/PRD.md`，开发前先查阅
2. API 接口定义参考 `docs/API.md`
3. 数据库 Schema 见 `server/database/schema.sql`
4. 三条基本原则：
   - **后端** 使用 Koa，不用 Express
   - **用户端** 用 UniApp (Vue 3)，不用原生
   - **管理端** 用 React + Ant Design，不用 Vue

## 常用命令

```bash
# 后端启动
cd server && cp .env.example .env && npm install && node database/init.js && npm run dev

# 管理端启动
cd admin && npm install && npm run dev

# App 端启动
cd client && npm install && npm run dev:h5
```

## 智能体配置

### backend-agent
- 专注 Node.js + Koa + SQLite 开发
- 参考规则：`.qoder/rules/backend.md`

### admin-agent
- 专注 React + Ant Design 后台开发
- 参考规则：`.qoder/rules/admin.md`

### client-agent
- 专注 UniApp 用户端开发
- 参考规则：`.qoder/rules/client.md`
