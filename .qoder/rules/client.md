# 用户端 App 开发规则 (UniApp)

## 技术框架

- UniApp (Vue 3 Composition API)
- Pinia 状态管理
- 支持编译到：微信小程序 / H5 / App

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| pages/index/index | 首页 | 关卡地图，学科选择 |
| pages/login/login | 登录 | 手机号验证码登录 |
| pages/category/category | 学科 | 学科详情 |
| pages/level/level | 关卡 | 关卡列表 |
| pages/quiz/quiz | 答题 | 6 题答题核心流程 |
| pages/result/result | 结果 | 结算页，得分+解析列表 |
| pages/profile/profile | 个人中心 | 用户信息与进度 |

## API 调用

统一放在 `src/api/` 目录，使用 `uni.request()`。

## 状态管理

使用 Pinia，store 文件放 `src/store/` 目录。
