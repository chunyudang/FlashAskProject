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

# App 端启动（使用 HBuilderX）
用 HBuilderX 打开 flashask-client 目录，点击「运行」→「运行到浏览器」或「运行到手机/模拟器」
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

---

## flashask-client 当前进度与上下文

### 技术栈
- **框架**：UniApp (Vue 3, HBuilderX 原生模式，非 Vite CLI)
- **语言**：TypeScript + Composition API (`<script setup lang="ts">`)，箭头函数
- **状态管理**：纯 `reactive()` 单例模式（无 Pinia）
- **HTTP 请求**：`uni.request()` 封装（`api/index.ts`）
- **启动方式**：HBuilderX「运行 → 运行到浏览器」

### 目录结构
```
flashask-client/
├── App.vue                    # 根组件（脚手架，勿修改）
├── main.js                    # 入口（脚手架，勿修改）
├── manifest.json              # 应用配置（脚手架，勿修改）
├── pages.json                 # ✅ 已添加: 7 路由 + TabBar
├── index.html                 # H5 入口（脚手架）
├── api/                       # HTTP 请求模块
│   ├── index.ts               #   get/post/put/del 封装
│   ├── auth.ts                #   登录/注册
│   ├── categories.ts          #   学科分类
│   ├── levels.ts              #   关卡列表
│   ├── questions.ts           #   题目获取/提交
│   └── progress.ts            #   用户进度
├── store/                     # 状态管理（reactive 单例）
│   ├── user.ts                #   用户状态（token, user, login/logout）
│   └── quiz.ts                #   答题状态（questions, answers, submit）
├── pages/                     # 页面组件
│   ├── index/index.vue        #   首页（TabBar）
│   ├── login/login.vue        #   登录/注册（手机号 + 昵称）
│   ├── category/category.vue  #   学科选择（网格布局）
│   ├── level/level.vue        #   关卡列表（锁定/解锁/完成）
│   ├── quiz/quiz.vue          #   答题流程（6题，进度条，解析）
│   ├── result/result.vue      #   答题结果（计分，答案解析）
│   └── profile/profile.vue    #   我的（TabBar，统计概览）
├── static/tab/                # TabBar 图标 SVG
│   ├── home.svg / home-active.svg
│   └── profile.svg / profile-active.svg
└── uni.scss                   # 样式变量
```

### 页面路由
| 路径 | 说明 | TabBar |
|------|------|--------|
| `pages/index/index` | 首页（分类列表） | ✅ 首页 |
| `pages/login/login` | 登录/注册 | ❌ |
| `pages/category/category` | 学科选择 | ❌ |
| `pages/level/level` | 关卡列表（带进度） | ❌ |
| `pages/quiz/quiz` | 答题（6题） | ❌ |
| `pages/result/result` | 结果 + 解析 | ❌ |
| `pages/profile/profile` | 个人中心 | ✅ 我的 |

### 计分规则
- 每题 100 分，共 6 题
- 答对 4 题以上（含）过关，额外 +200 分奖励
- 总分 = 正确题数 × 100 + (过关 ? 200 : 0)

### 已知问题 / 注意事项
1. **⚠️ HBuilderX 运行报错**：`SyntaxError: Unexpected token .`，疑似 `@dcloudio/uni-app` 模块在纯 HBuilderX 原生模式下不可解析
2. **已修复**：4 个页面的 `import { onLoad/onShow } from '@dcloudio/uni-app'` 已改为 `onMounted` + `getCurrentPages()` 全局 API 方式
3. **TabBar 图标**：使用 SVG 格式，H5 运行正常；若发布微信小程序需转换为 PNG
4. **尚未对接后端**：当前 API 层已写好，但尚未验证与后端 (`server/`) 的联调
5. **后端接口地址**：`api/index.ts` 中 `BASE_URL = '/api'`，HBuilderX 运行时需配置代理或改为完整 URL

### 待解决
- [ ] 排查 HBuilderX 原生模式的 `SyntaxError` 根因
- [ ] 配置 API 代理或跨域（前端 `/api` 指向后端 `localhost:3000/api`）
- [ ] 验证与后端接口的联调
- [ ] 为 TabBar 准备 PNG 格式图标（生产构建用）
