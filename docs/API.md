# API 接口文档

## 基础路径

所有 API 以 `/api` 为前缀。

## 数据格式

- 请求体：JSON 格式
- 响应体：JSON 格式
- 认证方式：`Authorization: Bearer <token>`

## 用户端接口

### 认证

#### POST /api/auth/register
用户注册（手机号+昵称）

**请求体：**
```json
{
  "phone": "13800000000",
  "nickname": "张三"
}
```

**响应：**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "nickname": "张三",
    "phone": "13800000000"
  }
}
```

**错误：** 409（手机号已注册）、400（参数缺失）

#### POST /api/auth/login
用户登录

**请求体：**
```json
{
  "phone": "13800000000"
}
```

**响应：**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "nickname": "张三",
    "phone": "13800000000"
  }
}
```

**错误：** 404（手机号未注册）、400（参数缺失）

---

### 学科 & 关卡

#### GET /api/categories
获取学科列表（公开接口）

**响应：**
```json
{
  "data": [
    { "id": "uuid", "name": "科学", "icon": "🔬", "sort_order": 1, "description": "自然科学..." }
  ]
}
```

#### GET /api/levels/:categoryId
获取学科下的关卡列表（公开接口，携带 token 可获取进度信息）

**请求头（可选）：** `Authorization: Bearer <token>`

**响应：**
```json
{
  "data": [
    {
      "id": "uuid",
      "category_id": "uuid",
      "name": "物理入门",
      "level_number": 1,
      "pass_threshold": 4,
      "description": "自然科学第1关",
      "progress": {
        "status": "unlocked",
        "best_score": 0,
        "completed_at": null
      }
    }
  ]
}
```

---

### 答题

#### GET /api/questions/:levelId
获取关卡题目（需登录，不返回正确答案）

**请求头：** `Authorization: Bearer <token>`

**响应：**
```json
{
  "data": [
    {
      "id": "uuid",
      "level_id": "uuid",
      "question": "光在真空中的传播速度约为多少？",
      "options": ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"],
      "explanation": "光在真空中的速度是 3×10⁸ m/s",
      "tags": ["科学"],
      "difficulty": "easy",
      "sort_order": 1
    }
  ],
  "total": 6
}
```

#### POST /api/questions/submit
提交答题结果（需登录）

**请求头：** `Authorization: Bearer <token>`

**请求体：**
```json
{
  "levelId": "uuid",
  "answers": [
    { "questionId": "uuid", "selectedIndex": 1 },
    { "questionId": "uuid", "selectedIndex": 0 }
  ]
}
```

**响应：**
```json
{
  "score": 500,
  "correct": 5,
  "total": 6,
  "passed": true,
  "passThreshold": 4,
  "explanations": [
    {
      "questionId": "uuid",
      "selectedIndex": 1,
      "correctIndex": 1,
      "isCorrect": true,
      "explanation": "光在真空中的速度是..."
    }
  ]
}
```

**计分规则：** 答对 +100 分/题，通关（≥4 题正确）额外 +200 分

---

### 进度

#### GET /api/progress
获取用户进度（需登录）

**请求头：** `Authorization: Bearer <token>`

**响应：**
```json
{
  "data": [
    {
      "id": "uuid",
      "level_id": "uuid",
      "status": "completed",
      "best_score": 600,
      "attempts": 2,
      "completed_at": "2024-01-01T00:00:00.000Z",
      "level_name": "物理入门",
      "level_number": 1,
      "category_id": "uuid",
      "category_name": "科学"
    }
  ],
  "stats": {
    "total_score": 1000,
    "total_correct": 20,
    "total_wrong": 10,
    "completed_levels": 2,
    "total_levels": 25
  }
}
```

#### POST /api/progress/unlock
解锁关卡（需登录）

**请求头：** `Authorization: Bearer <token>`

**请求体：**
```json
{
  "levelId": "uuid"
}
```

**响应：**
```json
{
  "success": true,
  "message": "关卡已解锁"
}
```

---

## 管理端接口

### 管理员登录

#### POST /api/admin/login

**请求体：**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应：**
```json
{
  "token": "eyJhbGci...",
  "admin": {
    "id": "uuid",
    "username": "admin",
    "nickname": "管理员"
  }
}
```

---

### 题目管理（需 Admin Token）

以下接口均需携带 `Authorization: Bearer <token>`

#### GET /api/admin/questions
题目列表，支持分页和筛选

**查询参数：** `?page=1&pageSize=20&categoryId=xxx&levelId=xxx`

**响应：**
```json
{
  "data": [
    {
      "id": "uuid",
      "level_id": "uuid",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "...",
      "tags": ["科学"],
      "difficulty": "easy",
      "level_name": "物理入门",
      "category_name": "科学"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### POST /api/admin/questions
新增题目

**请求体：**
```json
{
  "levelId": "uuid",
  "question": "题目内容",
  "options": ["A选项", "B选项", "C选项", "D选项"],
  "correctIndex": 0,
  "explanation": "解析内容",
  "tags": ["标签"],
  "difficulty": "easy",
  "sortOrder": 1
}
```

#### PUT /api/admin/questions/:id
编辑题目（字段可选）

#### DELETE /api/admin/questions/:id
删除题目

---

### 学科管理（需 Admin Token）

#### GET /api/admin/categories
学科列表

#### POST /api/admin/categories
新增学科

**请求体：**
```json
{
  "name": "学科名",
  "icon": "🔬",
  "sortOrder": 1,
  "description": "描述"
}
```

#### PUT /api/admin/categories/:id
编辑学科

#### DELETE /api/admin/categories/:id
删除学科（需先删除关联关卡）

---

### 关卡管理（需 Admin Token）

#### POST /api/admin/levels
新增关卡

**请求体：**
```json
{
  "categoryId": "uuid",
  "name": "关卡名",
  "levelNumber": 1,
  "passThreshold": 4,
  "description": "描述"
}
```

#### PUT /api/admin/levels/:id
编辑关卡

#### DELETE /api/admin/levels/:id
删除关卡（需先删除关联题目）

---

### 用户管理（需 Admin Token）

#### GET /api/admin/users
用户列表，支持分页

**查询参数：** `?page=1&pageSize=20`

**响应：**
```json
{
  "data": [
    {
      "id": "uuid",
      "nickname": "张三",
      "phone": "13800000000",
      "total_score": 1000,
      "total_correct": 20,
      "total_wrong": 10,
      "last_login_at": "...",
      "created_at": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 测试账号

| 角色 | 账号 | 密码/手机号 |
|------|------|------------|
| 用户 | 13800000000 |（手机号登录）|
| 管理员 | admin | admin123 |
| 测试管理员 | testadmin | test123 |
