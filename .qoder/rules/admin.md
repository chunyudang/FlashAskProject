# 后台管理开发规则 (React + Ant Design)

## 技术框架

- React 18 + TypeScript
- Ant Design 5 组件库
- React Router 6 路由
- Axios HTTP 请求
- Vite 构建工具

## 页面列表

| 路由 | 页面 | 说明 |
|------|------|------|
| /login | 登录页 | 管理员登录 |
| / | 题目列表 | 题目 CRUD 核心页 |
| /questions/new | 新建题目 | 题目表单 |
| /questions/:id/edit | 编辑题目 | 修改题目 |
| /categories | 学科管理 | 学科 CRUD |
| /levels | 关卡管理 | 关卡 CRUD |
| /users | 用户列表 | 查看用户信息 |

## API 调用

统一用 `src/api/` 下的模块，Axios 实例配置 baseURL（开发环境通过 Vite proxy 代理到后端）。
