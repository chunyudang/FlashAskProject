const express = require('express');
const router = express.Router();

// GET /api/progress — 获取用户进度
router.get('/', (req, res) => {
  // TODO
  res.json({});
});

// POST /api/progress/unlock — 解锁下一关
router.post('/unlock', (req, res) => {
  // TODO
  res.json({ success: true });
});

module.exports = router;
