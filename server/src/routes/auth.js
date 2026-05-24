const Router = require('@koa/router');
const router = new Router({ prefix: '/api/auth' });

router.post('/login', (ctx) => {
  // TODO: Implement login
  ctx.body = { message: '登录' };
});

router.post('/register', (ctx) => {
  // TODO: Implement register
  ctx.body = { message: '注册' };
});

module.exports = router;
