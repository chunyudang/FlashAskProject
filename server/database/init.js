const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'flash_ask.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Remove existing DB if exists (dev only)
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Removed existing database');
}

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Run schema
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

console.log('✅  Database created successfully');
console.log(`📁  Location: ${dbPath}`);

// Seed admin user
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('crypto');

const adminId = crypto.randomUUID();
const hash = bcrypt.hashSync('admin123', 10);

db.prepare(`
  INSERT INTO admin_users (id, username, password_hash, nickname)
  VALUES (?, ?, ?, ?)
`).run(adminId, 'admin', hash, '管理员');

console.log('👤  Default admin account created: admin / admin123');
console.log('⚠️   Change password immediately in production!');

db.close();
