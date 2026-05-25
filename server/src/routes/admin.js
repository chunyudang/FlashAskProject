const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../db');
const { adminAuthMiddleware } = require('../middleware/auth');

const router = new Router({ prefix: '/api/admin' });
const JWT_SECRET = process.env.JWT_SECRET || 'flash_ask_dev_jwt_secret_2024';
const JWT_EXPIRES_IN = '24h';

// POST /api/admin/login - 管理员登录
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { error: '用户名和密码不能为空' };
    return;
  }

  const admin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!admin) {
    ctx.status = 401;
    ctx.body = { error: '用户名或密码错误' };
    return;
  }

  if (admin.status !== 'active') {
    ctx.status = 403;
    ctx.body = { error: '该账号已被禁用' };
    return;
  }

  const valid = bcrypt.compareSync(password, admin.password_hash);
  if (!valid) {
    ctx.status = 401;
    ctx.body = { error: '用户名或密码错误' };
    return;
  }

  // Update last_login_at
  db.prepare('UPDATE admin_users SET last_login_at = ? WHERE id = ?')
    .run(new Date().toISOString(), admin.id);

  const token = jwt.sign({ adminId: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  ctx.body = {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      nickname: admin.nickname
    }
  };
});

// === Admin CRUD routes (all require admin auth) ===

// --- Questions CRUD ---

// GET /api/admin/questions - 题目列表（分页）
router.get('/questions', adminAuthMiddleware, async (ctx) => {
  const page = parseInt(ctx.query.page) || 1;
  const pageSize = parseInt(ctx.query.pageSize) || 20;
  const offset = (page - 1) * pageSize;
  const categoryId = ctx.query.categoryId;
  const levelId = ctx.query.levelId;

  let whereClause = '';
  const params = [];

  if (levelId) {
    whereClause = 'WHERE q.level_id = ?';
    params.push(levelId);
  } else if (categoryId) {
    whereClause = 'WHERE l.category_id = ?';
    params.push(categoryId);
  }

  const countSql = `
    SELECT COUNT(*) as count
    FROM questions q
    LEFT JOIN levels l ON l.id = q.level_id
    ${whereClause}
  `;
  const { count } = db.prepare(countSql).get(...params);

  const dataSql = `
    SELECT q.*, l.name AS level_name, l.level_number, l.category_id,
           c.name AS category_name
    FROM questions q
    LEFT JOIN levels l ON l.id = q.level_id
    LEFT JOIN categories c ON c.id = l.category_id
    ${whereClause}
    ORDER BY l.category_id ASC, l.level_number ASC, q.sort_order ASC
    LIMIT ? OFFSET ?
  `;

  const questions = db.prepare(dataSql).all(...params, pageSize, offset);

  // Parse JSON fields
  const parsed = questions.map(q => ({
    ...q,
    options: JSON.parse(q.options),
    tags: JSON.parse(q.tags)
  }));

  ctx.body = {
    data: parsed,
    pagination: { page, pageSize, total: count, totalPages: Math.ceil(count / pageSize) }
  };
});

// POST /api/admin/questions - 新增题目
router.post('/questions', adminAuthMiddleware, async (ctx) => {
  const { levelId, question, options, correctIndex, explanation, tags, difficulty, sortOrder } = ctx.request.body;

  if (!levelId || !question || !options || correctIndex === undefined || !explanation) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整' };
    return;
  }

  // Validate level exists
  const level = db.prepare('SELECT id FROM levels WHERE id = ?').get(levelId);
  if (!level) {
    ctx.status = 404;
    ctx.body = { error: '关卡不存在' };
    return;
  }

  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO questions (id, level_id, question, options, correct_index, explanation, tags, difficulty, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    levelId,
    question,
    JSON.stringify(options),
    correctIndex,
    explanation,
    JSON.stringify(tags || []),
    difficulty || 'easy',
    sortOrder || 0
  );

  ctx.body = { id, message: '题目创建成功' };
});

// PUT /api/admin/questions/:id - 编辑题目
router.put('/questions/:id', adminAuthMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const { question, options, correctIndex, explanation, tags, difficulty, sortOrder } = ctx.request.body;

  const existing = db.prepare('SELECT id FROM questions WHERE id = ?').get(id);
  if (!existing) {
    ctx.status = 404;
    ctx.body = { error: '题目不存在' };
    return;
  }

  const updates = [];
  const params = [];

  if (question !== undefined) { updates.push('question = ?'); params.push(question); }
  if (options !== undefined) { updates.push('options = ?'); params.push(JSON.stringify(options)); }
  if (correctIndex !== undefined) { updates.push('correct_index = ?'); params.push(correctIndex); }
  if (explanation !== undefined) { updates.push('explanation = ?'); params.push(explanation); }
  if (tags !== undefined) { updates.push('tags = ?'); params.push(JSON.stringify(tags)); }
  if (difficulty !== undefined) { updates.push('difficulty = ?'); params.push(difficulty); }
  if (sortOrder !== undefined) { updates.push('sort_order = ?'); params.push(sortOrder); }

  if (updates.length === 0) {
    ctx.body = { message: '无变更' };
    return;
  }

  params.push(id);
  db.prepare(`UPDATE questions SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  ctx.body = { message: '题目更新成功' };
});

// DELETE /api/admin/questions/:id - 删除题目
router.delete('/questions/:id', adminAuthMiddleware, async (ctx) => {
  const { id } = ctx.params;

  const existing = db.prepare('SELECT id FROM questions WHERE id = ?').get(id);
  if (!existing) {
    ctx.status = 404;
    ctx.body = { error: '题目不存在' };
    return;
  }

  db.prepare('DELETE FROM questions WHERE id = ?').run(id);
  ctx.body = { message: '题目已删除' };
});

// --- Categories CRUD ---

// GET /api/admin/categories - 学科列表
router.get('/categories', adminAuthMiddleware, async (ctx) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
  ctx.body = { data: categories };
});

// POST /api/admin/categories - 新增学科
router.post('/categories', adminAuthMiddleware, async (ctx) => {
  const { name, icon, sortOrder, description } = ctx.request.body;

  if (!name) {
    ctx.status = 400;
    ctx.body = { error: '学科名称不能为空' };
    return;
  }

  const id = crypto.randomUUID();
  const maxSort = db.prepare('SELECT MAX(sort_order) as max_order FROM categories').get();

  db.prepare(`
    INSERT INTO categories (id, name, icon, sort_order, description)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, name, icon || '', sortOrder ?? (maxSort.max_order + 1 || 0), description || '');

  ctx.body = { id, message: '学科创建成功' };
});

// PUT /api/admin/categories/:id - 编辑学科
router.put('/categories/:id', adminAuthMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const { name, icon, sortOrder, description } = ctx.request.body;

  const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
  if (!existing) {
    ctx.status = 404;
    ctx.body = { error: '学科不存在' };
    return;
  }

  const updates = [];
  const params = [];

  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (icon !== undefined) { updates.push('icon = ?'); params.push(icon); }
  if (sortOrder !== undefined) { updates.push('sort_order = ?'); params.push(sortOrder); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }

  if (updates.length === 0) {
    ctx.body = { message: '无变更' };
    return;
  }

  params.push(id);
  db.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  ctx.body = { message: '学科更新成功' };
});

// DELETE /api/admin/categories/:id - 删除学科
router.delete('/categories/:id', adminAuthMiddleware, async (ctx) => {
  const { id } = ctx.params;

  const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
  if (!existing) {
    ctx.status = 404;
    ctx.body = { error: '学科不存在' };
    return;
  }

  // Check if there are levels associated
  const levelCount = db.prepare('SELECT COUNT(*) as count FROM levels WHERE category_id = ?').get(id);
  if (levelCount.count > 0) {
    ctx.status = 400;
    ctx.body = { error: `该学科下有 ${levelCount.count} 个关卡，请先删除关卡` };
    return;
  }

  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  ctx.body = { message: '学科已删除' };
});

// --- Levels CRUD ---

// POST /api/admin/levels - 新增关卡
router.post('/levels', adminAuthMiddleware, async (ctx) => {
  const { categoryId, name, levelNumber, passThreshold, description } = ctx.request.body;

  if (!categoryId || !name) {
    ctx.status = 400;
    ctx.body = { error: '学科 ID 和关卡名称不能为空' };
    return;
  }

  // Validate category exists
  const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(categoryId);
  if (!category) {
    ctx.status = 404;
    ctx.body = { error: '学科不存在' };
    return;
  }

  const id = crypto.randomUUID();
  const maxNumber = db.prepare(
    'SELECT MAX(level_number) as max_num FROM levels WHERE category_id = ?'
  ).get(categoryId);

  db.prepare(`
    INSERT INTO levels (id, category_id, name, level_number, pass_threshold, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    categoryId,
    name,
    levelNumber ?? (maxNumber.max_num + 1 || 1),
    passThreshold || 4,
    description || ''
  );

  ctx.body = { id, message: '关卡创建成功' };
});

// PUT /api/admin/levels/:id - 编辑关卡
router.put('/levels/:id', adminAuthMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const { name, levelNumber, passThreshold, description } = ctx.request.body;

  const existing = db.prepare('SELECT id FROM levels WHERE id = ?').get(id);
  if (!existing) {
    ctx.status = 404;
    ctx.body = { error: '关卡不存在' };
    return;
  }

  const updates = [];
  const params = [];

  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (levelNumber !== undefined) { updates.push('level_number = ?'); params.push(levelNumber); }
  if (passThreshold !== undefined) { updates.push('pass_threshold = ?'); params.push(passThreshold); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }

  if (updates.length === 0) {
    ctx.body = { message: '无变更' };
    return;
  }

  params.push(id);
  db.prepare(`UPDATE levels SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  ctx.body = { message: '关卡更新成功' };
});

// DELETE /api/admin/levels/:id - 删除关卡
router.delete('/levels/:id', adminAuthMiddleware, async (ctx) => {
  const { id } = ctx.params;

  const existing = db.prepare('SELECT id FROM levels WHERE id = ?').get(id);
  if (!existing) {
    ctx.status = 404;
    ctx.body = { error: '关卡不存在' };
    return;
  }

  // Check if there are questions associated
  const questionCount = db.prepare('SELECT COUNT(*) as count FROM questions WHERE level_id = ?').get(id);
  if (questionCount.count > 0) {
    ctx.status = 400;
    ctx.body = { error: `该关卡下有 ${questionCount.count} 道题目，请先删除题目` };
    return;
  }

  db.prepare('DELETE FROM levels WHERE id = ?').run(id);
  ctx.body = { message: '关卡已删除' };
});

// --- Users ---

// GET /api/admin/users - 用户列表
router.get('/users', adminAuthMiddleware, async (ctx) => {
  const page = parseInt(ctx.query.page) || 1;
  const pageSize = parseInt(ctx.query.pageSize) || 20;
  const offset = (page - 1) * pageSize;

  const { count } = db.prepare('SELECT COUNT(*) as count FROM users').get();

  const users = db.prepare(`
    SELECT id, nickname, avatar_url, phone, total_score, total_correct, total_wrong, last_login_at, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(pageSize, offset);

  ctx.body = {
    data: users,
    pagination: { page, pageSize, total: count, totalPages: Math.ceil(count / pageSize) }
  };
});

module.exports = router;
