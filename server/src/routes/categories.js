const Router = require('@koa/router');
const router = new Router({ prefix: '/api/categories' });

router.get('/', (ctx) => {
  // TODO: 获取所有学科
  ctx.body = [];
});

module.exports = router;
