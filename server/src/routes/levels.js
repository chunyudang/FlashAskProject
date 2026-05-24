const Router = require('@koa/router');
const router = new Router({ prefix: '/api/levels' });

router.get('/:categoryId', (ctx) => {
  // TODO: 获取某个学科的关卡列表
  ctx.body = [];
});

module.exports = router;
