const jwt = require('jsonwebtoken');

// 用户端 JWT 鉴权
async function authMiddleware(ctx, next) {
  const token = ctx.headers.authorization?.split(' ')[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: '未登录' };
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.userId = decoded.userId;
    await next();
  } catch {
    ctx.status = 401;
    ctx.body = { error: '登录已过期' };
  }
}

// 管理端 JWT 鉴权
async function adminAuthMiddleware(ctx, next) {
  const token = ctx.headers.authorization?.split(' ')[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: '未登录' };
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.adminId = decoded.adminId;
    await next();
  } catch {
    ctx.status = 401;
    ctx.body = { error: '登录已过期' };
  }
}

module.exports = { authMiddleware, adminAuthMiddleware };
