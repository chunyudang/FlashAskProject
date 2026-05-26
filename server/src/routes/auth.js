const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../db');

const router = new Router({ prefix: '/api/auth' });

const JWT_SECRET = process.env.JWT_SECRET || 'flash_ask_dev_jwt_secret_2024';
const JWT_EXPIRES_IN = '7d';

// POST /api/auth/register
router.post('/register', async (ctx) => {
  const { phone, password, nickname } = ctx.request.body;

  if (!phone || !password || !nickname) {
    ctx.status = 400;
    ctx.body = { error: '手机号、密码和昵称不能为空' };
    return;
  }

  if (!/^1\d{10}$/.test(phone)) {
    ctx.status = 400;
    ctx.body = { error: '手机号格式不正确' };
    return;
  }

  if (password.length < 6) {
    ctx.status = 400;
    ctx.body = { error: '密码长度不能少于6位' };
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
  const passwordHash = bcrypt.hashSync(password, 10);
  const dbToken = crypto.randomUUID();

  db.prepare(`
    INSERT INTO users (id, nickname, phone, password_hash, token, last_login_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, nickname, phone, passwordHash, dbToken, now, now);

  const token = jwt.sign({ userId: id, phone }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  ctx.body = {
    token,
    dbToken,
    user: { id, nickname, phone }
  };
});

// POST /api/auth/login
router.post('/login', async (ctx) => {
  const { phone, password } = ctx.request.body;

  if (!phone || !password) {
    ctx.status = 400;
    ctx.body = { error: '手机号和密码不能为空' };
    return;
  }

  const user = db.prepare('SELECT id, nickname, phone, password_hash FROM users WHERE phone = ?').get(phone);
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: '该手机号未注册' };
    return;
  }

  // Verify password
  if (!bcrypt.compareSync(password, user.password_hash)) {
    ctx.status = 401;
    ctx.body = { error: '手机号或密码错误' };
    return;
  }

  // Generate new dbToken for auto-login
  const dbToken = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare('UPDATE users SET token = ?, last_login_at = ? WHERE id = ?')
    .run(dbToken, now, user.id);

  const token = jwt.sign({ userId: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  ctx.body = {
    token,
    dbToken,
    user: { id: user.id, nickname: user.nickname, phone: user.phone }
  };
});

// POST /api/auth/verify — auto-login via dbToken
router.post('/verify', async (ctx) => {
  const { dbToken } = ctx.request.body;

  if (!dbToken) {
    ctx.status = 400;
    ctx.body = { error: 'token 不能为空' };
    return;
  }

  const user = db.prepare('SELECT id, nickname, phone FROM users WHERE token = ?').get(dbToken);
  if (!user) {
    ctx.status = 401;
    ctx.body = { error: '登录已过期，请重新登录' };
    return;
  }

  // Issue new JWT
  const token = jwt.sign({ userId: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  ctx.body = {
    token,
    user
  };
});

module.exports = router;
