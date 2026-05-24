# 后端开发规则

## 技术框架

- Node.js + Koa 2 (async/await)
- @koa/router 路由
- @koa/cors 跨域
- koa-body 请求体解析
- better-sqlite3 数据库
- jsonwebtoken + bcryptjs 鉴权

## 目录结构

```
server/
├── src/
│   ├── app.js              # 入口文件
│   ├── routes/             # 路由模块
│   │   ├── auth.js         # 用户认证
│   │   ├── categories.js   # 学科
│   │   ├── levels.js       # 关卡
│   │   ├── questions.js    # 题目 & 答题
│   │   ├── progress.js     # 用户进度
│   │   └── admin.js        # 管理端 API
│   ├── controllers/        # 业务逻辑（可选分离）
│   ├── models/             # 数据模型
│   └── middleware/
│       └── auth.js         # JWT 鉴权中间件
└── database/
    ├── schema.sql          # 建表 SQL
    └── init.js             # 初始化脚本
```

## API 路由风格

```js
const Router = require('@koa/router');
const router = new Router({ prefix: '/api/xxx' });

router.get('/list', async (ctx) => {
  ctx.body = { data: [] };
});

module.exports = router;
```

## 数据库命名

- 表名：小写复数（users, questions）
- 字段：snake_case（total_score, last_login_at）
- SQLite 主键使用 TEXT 类型存储 UUID
