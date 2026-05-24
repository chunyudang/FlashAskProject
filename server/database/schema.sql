-- ============================================
-- 闪问(FlashAsk) 数据库 Schema (SQLite)
-- MVP v1.0
-- ============================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  phone TEXT UNIQUE NOT NULL,
  total_score INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_wrong INTEGER DEFAULT 0,
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 学科分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  description TEXT DEFAULT ''
);

-- 关卡表
CREATE TABLE IF NOT EXISTS levels (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  pass_threshold INTEGER DEFAULT 4,
  description TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 题目表
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,       -- JSON 数组
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  tags TEXT DEFAULT '[]',       -- JSON 数组
  difficulty TEXT DEFAULT 'easy',
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (level_id) REFERENCES levels(id)
);

-- 用户进度表
CREATE TABLE IF NOT EXISTS user_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  level_id TEXT NOT NULL,
  status TEXT DEFAULT 'locked',  -- locked / completed
  best_score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (level_id) REFERENCES levels(id),
  UNIQUE(user_id, level_id)
);

-- 答题记录表
CREATE TABLE IF NOT EXISTS user_answers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_index INTEGER,
  is_correct INTEGER NOT NULL,
  answered_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- 管理员表
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_levels_category ON levels(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_level ON questions(level_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_level ON user_progress(level_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_user ON user_answers(user_id);
