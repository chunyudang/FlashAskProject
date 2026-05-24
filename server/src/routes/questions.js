const Router = require('@koa/router');
const router = new Router({ prefix: '/api/questions' });

router.get('/:levelId', (ctx) => {
  // TODO: 获取关卡题目
  ctx.body = [];
});

router.post('/submit', (ctx) => {
  // TODO: 提交答题结果
  ctx.body = { score: 0, correct: 0, total: 6 };
});

module.exports = router;
