const Router = require('@koa/router');
const crypto = require('crypto');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = new Router({ prefix: '/api/progress' });

// GET /api/progress - 获取用户进度（需登录）
router.get('/', authMiddleware, async (ctx) => {
  const userId = ctx.state.userId;

  const progress = db.prepare(`
    SELECT
      up.id,
      up.level_id,
      up.status,
      up.best_score,
      up.attempts,
      up.completed_at,
      l.name AS level_name,
      l.level_number,
      l.category_id,
      c.name AS category_name
    FROM user_progress up
    JOIN levels l ON l.id = up.level_id
    JOIN categories c ON c.id = l.category_id
    WHERE up.user_id = ?
    ORDER BY c.sort_order ASC, l.level_number ASC
  `).all(userId);

  // Calculate overall stats
  const userStats = db.prepare(
    'SELECT total_score, total_correct, total_wrong FROM users WHERE id = ?'
  ).get(userId);

  // Total levels count
  const totalLevels = db.prepare('SELECT COUNT(*) as count FROM levels').get();

  ctx.body = {
    data: progress,
    stats: {
      total_score: userStats?.total_score || 0,
      total_correct: userStats?.total_correct || 0,
      total_wrong: userStats?.total_wrong || 0,
      completed_levels: progress.filter(p => p.status === 'completed').length,
      total_levels: totalLevels.count
    }
  };
});

// POST /api/progress/unlock - 解锁关卡（需登录）
router.post('/unlock', authMiddleware, async (ctx) => {
  const { levelId } = ctx.request.body;
  const userId = ctx.state.userId;

  if (!levelId) {
    ctx.status = 400;
    ctx.body = { error: '关卡 ID 不能为空' };
    return;
  }

  // Check level exists
  const level = db.prepare('SELECT * FROM levels WHERE id = ?').get(levelId);
  if (!level) {
    ctx.status = 404;
    ctx.body = { error: '关卡不存在' };
    return;
  }

  // Check if already unlocked/completed
  const existing = db.prepare(
    'SELECT status FROM user_progress WHERE user_id = ? AND level_id = ?'
  ).get(userId, levelId);

  if (existing && existing.status !== 'locked') {
    ctx.body = { success: true, message: '关卡已解锁' };
    return;
  }

  // If it's the first level of a category, automatically unlock it
  const firstLevel = db.prepare(
    'SELECT id FROM levels WHERE category_id = ? AND level_number = 1'
  ).get(level.category_id);

  if (level.id === firstLevel.id) {
    // First level is always unlockable
    if (existing) {
      db.prepare('UPDATE user_progress SET status = ? WHERE user_id = ? AND level_id = ?')
        .run('unlocked', userId, levelId);
    } else {
      db.prepare(`
        INSERT INTO user_progress (id, user_id, level_id, status)
        VALUES (?, ?, ?, ?)
      `).run(crypto.randomUUID(), userId, levelId, 'unlocked');
    }

    ctx.body = { success: true, message: '关卡已解锁' };
    return;
  }

  // Check if previous level is completed
  const prevLevel = db.prepare(
    'SELECT id FROM levels WHERE category_id = ? AND level_number = ?'
  ).get(level.category_id, level.level_number - 1);

  if (prevLevel) {
    const prevProgress = db.prepare(
      'SELECT status FROM user_progress WHERE user_id = ? AND level_id = ?'
    ).get(userId, prevLevel.id);

    if (!prevProgress || prevProgress.status !== 'completed') {
      ctx.status = 403;
      ctx.body = { error: '请先完成前一关卡' };
      return;
    }
  }

  // Unlock the level
  if (existing) {
    db.prepare('UPDATE user_progress SET status = ? WHERE user_id = ? AND level_id = ?')
      .run('unlocked', userId, levelId);
  } else {
    db.prepare(`
      INSERT INTO user_progress (id, user_id, level_id, status)
      VALUES (?, ?, ?, ?)
    `).run(crypto.randomUUID(), userId, levelId, 'unlocked');
  }

  ctx.body = { success: true, message: '关卡已解锁' };
});

module.exports = router;
