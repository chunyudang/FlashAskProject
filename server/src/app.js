const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const Router = require('@koa/router');
const path = require('path');

// Load env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(koaBody());

// Routes
app.use(require('./routes/auth').routes());
app.use(require('./routes/categories').routes());
app.use(require('./routes/levels').routes());
app.use(require('./routes/questions').routes());
app.use(require('./routes/progress').routes());
app.use(require('./routes/admin').routes());

// Health check
router.get('/api/health', (ctx) => {
  ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
});
app.use(router.routes());

// Error handler
app.on('error', (err, ctx) => {
  console.error('Server error:', err);
  ctx.status = ctx.status || 500;
  ctx.body = { error: 'Internal server error' };
});

app.listen(PORT, () => {
  console.log(`🚀 FlashAsk API running on http://localhost:${PORT}`);
  console.log(`📋  Health check: http://localhost:${PORT}/api/health`);
});
