const express = require('express');
const router = express.Router();

// GET /api/levels/:categoryId — 获取某个学科的关卡列表
router.get('/:categoryId', (req, res) => {
  // TODO
  res.json([]);
});

module.exports = router;
