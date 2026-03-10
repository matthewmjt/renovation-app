// server/db/index.js
// Single shared DB connection. To switch to PostgreSQL later:
//   1. npm install pg
//   2. Replace this file with a pg Pool — keep the same exported query interface
//   3. Update migrate.js with PostgreSQL DDL

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../../data");
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "renovation.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id          TEXT PRIMARY KEY,
    data        TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
