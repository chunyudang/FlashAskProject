<!--
 * @Author: dangchy 14676620+dangchy@user.noreply.gitee.com
 * @Date: 2026-05-24 13:39:58
 * @LastEditors: dangchy 14676620+dangchy@user.noreply.gitee.com
 * @LastEditTime: 2026-05-26 09:21:24
 * @FilePath: /FlashAskProject/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 闪问(FlashAsk) — 通识知识问答游戏

> **主 Slogan：** 5 分钟，给大脑充个电  
> **副 Slogan：** 不背答案，只练思维

## 项目结构

```
flash-ask/
├── flashask-client/          # 用户端 App (UniApp)
├── admin/           # 后台管理系统 (React + Ant Design)
├── server/          # 后端 API 服务 (Node.js + Koa2)
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

### App 端（使用 HBuilderX）

用 HBuilderX 打开 `flashask-client` 目录，点击「运行」→「运行到浏览器」或「运行到手机/模拟器」

支持编译目标：

- **H5**：运行到浏览器
- **微信小程序**：运行到微信小程序
- **App**：运行到手机/模拟器

## 技术栈

| 端     | 技术                    |
| ------ | ----------------------- |
| 用户端 | UniApp                  |
| 管理端 | React + Ant Design      |
| 后端   | Node.js + Koa2 + SQLite |

## 部署

详见 [DEPLOY.md](docs/DEPLOY.md)
