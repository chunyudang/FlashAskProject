const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

const router = new Router({ prefix: '/api/auth' });

const JWT_SECRET = process.env.JWT_SECRET || 'flash_ask_dev_jwt_secret_2024';
const JWT_EXPIRES_IN = '7d';

// POST /api/auth/register
router.post('/register', async (ctx) => {
  const { phone, nickname } = ctx.request.body;

  if (!phone || !nickname) {
    ctx.status = 400;
    ctx.body = { error: '手机号和昵称不能为空' };
    return;
  }

  // Check if phone already exists
  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) {
    ctx.status = 409;
    ctx.body = { error: '该手机号已注册' };
    return;
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (id, nickname, phone, last_login_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, nickname, phone, now, now);

  const token = jwt.sign({ userId: id, phone }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  ctx.body = {
    token,
    user: { id, nickname, phone }
  };
});

// POST /api/auth/login
router.post('/login', async (ctx) => {
  const { phone } = ctx.request.body;

  if (!phone) {
    ctx.status = 400;
    ctx.body = { error: '手机号不能为空' };
    return;
  }

  const user = db.prepare('SELECT id, nickname, phone FROM users WHERE phone = ?').get(phone);
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: '该手机号未注册' };
    return;
  }

  // Update last_login_at
  db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?')
    .run(new Date().toISOString(), user.id);

  const token = jwt.sign({ userId: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  ctx.body = {
    token,
    user
  };
});

module.exports = router;
