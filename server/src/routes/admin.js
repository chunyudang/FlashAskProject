const express = require('express');
const router = express.Router();

// Admin 鉴权中间件
const authMiddleware = (req, res, next) => {
  // TODO: JWT 验证
  next();
};

router.use(authMiddleware);

// 题目管理
router.get('/questions', (req, res) => { res.json([]); });
router.post('/questions', (req, res) => { res.json({}); });
router.put('/questions/:id', (req, res) => { res.json({}); });
router.delete('/questions/:id', (req, res) => { res.json({}); });

// 分类管理
router.get('/categories', (req, res) => { res.json([]); });
router.post('/categories', (req, res) => { res.json({}); });
router.put('/categories/:id', (req, res) => { res.json({}); });
router.delete('/categories/:id', (req, res) => { res.json({}); });

// 关卡管理
router.post('/levels', (req, res) => { res.json({}); });
router.put('/levels/:id', (req, res) => { res.json({}); });
router.delete('/levels/:id', (req, res) => { res.json({}); });

// 用户查看
router.get('/users', (req, res) => { res.json([]); });

// Admin 登录
router.post('/login', (req, res) => {
  // TODO: Admin login
  res.json({ token: '' });
});

module.exports = router;
