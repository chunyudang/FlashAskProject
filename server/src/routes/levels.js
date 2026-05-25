const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = new Router({ prefix: '/api/levels' });
const JWT_SECRET = process.env.JWT_SECRET || 'flash_ask_dev_jwt_secret_2024';

// GET /api/levels/:categoryId - 获取指定学科的关卡列表
router.get('/:categoryId', async (ctx) => {
  const { categoryId } = ctx.params;

  // Check category exists
  const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(categoryId);
  if (!category) {
    ctx.status = 404;
    ctx.body = { error: '学科不存在' };
    return;
  }

  // Get levels for this category
  const levels = db.prepare(
    'SELECT * FROM levels WHERE category_id = ? ORDER BY level_number ASC'
  ).all(categoryId);

  // Try to extract userId from token for progress info
  let userId = null;
  const authHeader = ctx.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch {
      // Token invalid, proceed without user info
    }
  }

  // If user is authenticated, attach progress status
  if (userId) {
    const progressRows = db.prepare(
      'SELECT level_id, status, best_score, completed_at FROM user_progress WHERE user_id = ?'
    ).all(userId);
    const progressMap = {};
    for (const p of progressRows) {
      progressMap[p.level_id] = { status: p.status, best_score: p.best_score, completed_at: p.completed_at };
    }

    const levelsWithProgress = levels.map(level => ({
      ...level,
      progress: progressMap[level.id] || { status: 'locked', best_score: 0, completed_at: null }
    }));

    ctx.body = { data: levelsWithProgress };
  } else {
    // Without auth, first level is unlocked, rest are locked
    const levelsWithProgress = levels.map((level, index) => ({
      ...level,
      progress: {
        status: index === 0 ? 'unlocked' : 'locked',
        best_score: 0,
        completed_at: null
      }
    }));

    ctx.body = { data: levelsWithProgress };
  }
});

module.exports = router;
