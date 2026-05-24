const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  // TODO: Implement login
  res.json({ message: '登录' });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  // TODO: Implement register
  res.json({ message: '注册' });
});

module.exports = router;
