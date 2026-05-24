# 闪问(FlashAsk) — 通识知识问答游戏

> **主 Slogan：** 5 分钟，给大脑充个电  
> **副 Slogan：** 不背答案，只练思维

## 项目结构

```
flash-ask/
├── client/          # 用户端 App (UniApp)
├── admin/           # 后台管理系统 (React + Ant Design)
├── server/          # 后端 API 服务 (Node.js + Express)
├── docs/            # 项目文档
└── .github/         # CI/CD 配置
```

## 开发环境要求

- Node.js >= 18
- npm >= 9

## 快速开始

### 后端

```bash
cd server
npm install
npm run dev
```

### 后台管理

```bash
cd admin
npm install
npm run dev
```

### App 端

```bash
cd client
npm install
npm run dev:mp-weixin   # 微信小程序
npm run dev:h5          # H5
npm run dev:app         # App
```

## 技术栈

| 端 | 技术 |
|---|------|
| 用户端 | UniApp |
| 管理端 | React + Ant Design |
| 后端 | Node.js + Express + SQLite |

## 部署

详见 [DEPLOY.md](docs/DEPLOY.md)
