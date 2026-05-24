const Router = require('@koa/router');
const router = new Router({ prefix: '/api/progress' });

router.get('/', (ctx) => {
  // TODO: 获取用户进度
  ctx.body = {};
});

router.post('/unlock', (ctx) => {
  // TODO: 解锁下一关
  ctx.body = { success: true };
});

module.exports = router;
