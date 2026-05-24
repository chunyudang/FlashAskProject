# 闪问(FlashAsk) 项目规则

## 项目概述

闪问(FlashAsk) 是一款通识知识问答游戏，采用游戏化闯关机制，覆盖科学、社会、逻辑、生活、人文五大领域。

## 技术栈

- **用户端 App**: UniApp (Vue 3 + Pinia)
- **后台管理**: React + Ant Design + Vite
- **后端 API**: Node.js + Koa + SQLite

## 核心功能 (MVP)

- 用户手机号登录
- 5 大学科 × 5 关卡 = 25 关
- 每关固定 6 题，答对 ≥ 4 题通关
- 即时对错反馈 + 结算页解析列表
- 积分系统：答对+100，通关+200
- 线性解锁，无体力限制，无每日挑战
- 后台管理系统：题目 CRUD + 学科/关卡管理 + 用户查看

## 开发规范

- 后端使用 Koa + @koa/router 框架
- 路由按模块拆分，放 server/src/routes/ 目录
- 数据库使用 SQLite，Schema 定义在 server/database/schema.sql
- API 文档维护在 docs/API.md
- 提交信息格式：type: 简短描述
