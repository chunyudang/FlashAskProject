const Router = require('@koa/router');
const db = require('../db');

const router = new Router({ prefix: '/api/categories' });

// GET /api/categories - 获取所有学科列表
router.get('/', async (ctx) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
  ctx.body = { data: categories };
});

module.exports = router;
