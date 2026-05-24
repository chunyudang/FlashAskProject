const jwt = require('jsonwebtoken');

// 用户端 JWT 鉴权
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '未登录' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: '登录已过期' });
  }
}

// 管理端 JWT 鉴权
function adminAuthMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: '未登录' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch {
    res.status(401).json({ error: '登录已过期' });
  }
}

module.exports = { authMiddleware, adminAuthMiddleware };
