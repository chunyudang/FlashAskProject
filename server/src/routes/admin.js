const Router = require('@koa/router');
const router = new Router({ prefix: '/api/admin' });

// Admin 鉴权中间件
router.use(async (ctx, next) => {
  // TODO: JWT 验证
  await next();
});

// 题目管理
router.get('/questions', (ctx) => { ctx.body = []; });
router.post('/questions', (ctx) => { ctx.body = {}; });
router.put('/questions/:id', (ctx) => { ctx.body = {}; });
router.delete('/questions/:id', (ctx) => { ctx.body = {}; });

// 分类管理
router.get('/categories', (ctx) => { ctx.body = []; });
router.post('/categories', (ctx) => { ctx.body = {}; });
router.put('/categories/:id', (ctx) => { ctx.body = {}; });
router.delete('/categories/:id', (ctx) => { ctx.body = {}; });

// 关卡管理
router.post('/levels', (ctx) => { ctx.body = {}; });
router.put('/levels/:id', (ctx) => { ctx.body = {}; });
router.delete('/levels/:id', (ctx) => { ctx.body = {}; });

// 用户查看
router.get('/users', (ctx) => { ctx.body = []; });

// Admin 登录
router.post('/login', (ctx) => {
  // TODO: Admin login
  ctx.body = { token: '' };
});

module.exports = router;
