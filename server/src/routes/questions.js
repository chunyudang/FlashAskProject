const express = require('express');
const router = express.Router();

// GET /api/questions/:levelId — 获取关卡题目
router.get('/:levelId', (req, res) => {
  // TODO
  res.json([]);
});

// POST /api/questions/submit — 提交答题结果
router.post('/submit', (req, res) => {
  // TODO
  res.json({ score: 0, correct: 0, total: 6 });
});

module.exports = router;
