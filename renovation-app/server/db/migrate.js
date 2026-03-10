// server/db/migrate.js
// Creates the SQLite schema. Safe to run multiple times (CREATE IF NOT EXISTS).
// When you're ready to move to PostgreSQL, swap the db driver here and
// translate the CREATE TABLE statements — the rest of the app stays identical.

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../../data");
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "renovation.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id          TEXT PRIMARY KEY,
    data        TEXT NOT NULL,   -- full property JSON blob
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id          TEXT PRIMARY KEY,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

console.log("Migration complete. DB at:", path.join(DATA_DIR, "renovation.db"));

module.exports = db;
