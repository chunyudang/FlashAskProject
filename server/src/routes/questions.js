const Router = require('@koa/router');
const crypto = require('crypto');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = new Router({ prefix: '/api/questions' });

// GET /api/questions/:levelId - 获取关卡题目（需登录）
router.get('/:levelId', authMiddleware, async (ctx) => {
  const { levelId } = ctx.params;
  const userId = ctx.state.userId;

  // Check level exists
  const level = db.prepare('SELECT * FROM levels WHERE id = ?').get(levelId);
  if (!level) {
    ctx.status = 404;
    ctx.body = { error: '关卡不存在' };
    return;
  }

  // Check if level is unlocked
  // For the first level of any category, it's always unlocked
  const firstLevelInCategory = db.prepare(
    'SELECT id FROM levels WHERE category_id = ? AND level_number = 1'
  ).get(level.category_id);

  if (level.id === firstLevelInCategory.id) {
    // First level is always unlocked
  } else {
    // Check if previous level is completed
    const prevLevel = db.prepare(
      'SELECT id FROM levels WHERE category_id = ? AND level_number = ?'
    ).get(level.category_id, level.level_number - 1);

    if (prevLevel) {
      const progress = db.prepare(
        'SELECT status FROM user_progress WHERE user_id = ? AND level_id = ?'
      ).get(userId, prevLevel.id);

      if (!progress || progress.status !== 'completed') {
        ctx.status = 403;
        ctx.body = { error: '请先完成前一关卡' };
        return;
      }
    }
  }

  // Get questions for this level (without correct_index)
  const questions = db.prepare(
    'SELECT id, level_id, question, options, explanation, tags, difficulty, sort_order FROM questions WHERE level_id = ? ORDER BY sort_order ASC'
  ).all(levelId);

  // Parse options JSON for each question
  const parsedQuestions = questions.map(q => ({
    ...q,
    options: JSON.parse(q.options),
    tags: JSON.parse(q.tags)
  }));

  ctx.body = { data: parsedQuestions, total: parsedQuestions.length };
});

// POST /api/questions/submit - 提交答题结果（需登录）
router.post('/submit', authMiddleware, async (ctx) => {
  const { levelId, answers } = ctx.request.body;
  const userId = ctx.state.userId;

  if (!levelId || !answers || !Array.isArray(answers)) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整' };
    return;
  }

  // Check level exists
  const level = db.prepare('SELECT * FROM levels WHERE id = ?').get(levelId);
  if (!level) {
    ctx.status = 404;
    ctx.body = { error: '关卡不存在' };
    return;
  }

  // Get all questions for this level
  const questions = db.prepare(
    'SELECT id, correct_index, explanation, options FROM questions WHERE level_id = ? ORDER BY sort_order ASC'
  ).all(levelId);

  if (questions.length === 0) {
    ctx.status = 404;
    ctx.body = { error: '该关卡暂无题目' };
    return;
  }

  // Grade each answer
  let correctCount = 0;
  const explanations = [];
  const answerMap = {};
  for (const a of answers) {
    answerMap[a.questionId] = a.selectedIndex;
  }

  for (const q of questions) {
    const selectedIndex = answerMap[q.id];
    const isCorrect = selectedIndex === q.correct_index;
    if (isCorrect) correctCount++;

    explanations.push({
      questionId: q.id,
      selectedIndex: selectedIndex !== undefined ? selectedIndex : -1,
      correctIndex: q.correct_index,
      isCorrect,
      explanation: q.explanation
    });
  }

  const passed = correctCount >= (level.pass_threshold || 4);
  const score = correctCount * 100 + (passed ? 200 : 0);

  const now = new Date().toISOString();

  // Record each answer
  const insertAnswer = db.prepare(`
    INSERT INTO user_answers (id, user_id, question_id, selected_index, is_correct, answered_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((answers) => {
    for (const a of answers) {
      const selectedIndex = answerMap[a.questionId];
      insertAnswer.run(crypto.randomUUID(), userId, a.id, selectedIndex !== undefined ? selectedIndex : null, selectedIndex === a.correct_index ? 1 : 0, now);
    }
  });
  insertMany(questions);

  // Update user stats
  db.prepare(`
    UPDATE users SET
      total_score = total_score + ?,
      total_correct = total_correct + ?,
      total_wrong = total_wrong + ?
    WHERE id = ?
  `).run(score, correctCount, questions.length - correctCount, userId);

  // Update progress
  const existingProgress = db.prepare(
    'SELECT id, best_score, attempts FROM user_progress WHERE user_id = ? AND level_id = ?'
  ).get(userId, levelId);

  if (existingProgress) {
    const newBestScore = Math.max(existingProgress.best_score, score);
    db.prepare(`
      UPDATE user_progress SET
        status = CASE WHEN ? = 1 THEN 'completed' ELSE status END,
        best_score = ?,
        attempts = attempts + 1,
        completed_at = CASE WHEN ? = 1 THEN ? ELSE completed_at END
      WHERE id = ?
    `).run(passed ? 1 : 0, newBestScore, passed ? 1 : 0, passed ? now : null, existingProgress.id);
  } else {
    db.prepare(`
      INSERT INTO user_progress (id, user_id, level_id, status, best_score, attempts, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      userId,
      levelId,
      passed ? 'completed' : 'attempted',
      score,
      1,
      passed ? now : null
    );
  }

  const totalQuestions = questions.length;
  ctx.body = {
    score,
    correct: correctCount,
    total: totalQuestions,
    passed,
    passThreshold: level.pass_threshold || 4,
    explanations
  };
});

module.exports = router;
