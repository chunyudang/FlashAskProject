# API 接口文档

> 待补充 — 开发时完善

## 基础路径

所有 API 以 `/api` 为前缀。

## 用户端接口

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册（手机号+验证码） |
| POST | /api/auth/login | 用户登录 |

### 学科 & 关卡

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/categories | 获取学科列表 |
| GET | /api/levels/:categoryId | 获取学科下的关卡列表 |

### 答题

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/questions/:levelId | 获取关卡题目 |
| POST | /api/questions/submit | 提交答题结果 |

### 进度

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/progress | 获取用户进度 |
| POST | /api/progress/unlock | 解锁关卡 |

## 管理端接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/admin/login | 管理员登录 |
| GET | /api/admin/questions | 题目列表 |
| POST | /api/admin/questions | 新增题目 |
| PUT | /api/admin/questions/:id | 编辑题目 |
| DELETE | /api/admin/questions/:id | 删除题目 |
| GET | /api/admin/categories | 学科列表 |
| POST | /api/admin/categories | 新增学科 |
| PUT | /api/admin/categories/:id | 编辑学科 |
| DELETE | /api/admin/categories/:id | 删除学科 |
| POST | /api/admin/levels | 新增关卡 |
| PUT | /api/admin/levels/:id | 编辑关卡 |
| DELETE | /api/admin/levels/:id | 删除关卡 |
| GET | /api/admin/users | 用户列表 |
