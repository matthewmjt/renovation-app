const express = require("express");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");
const { v4: uuid } = require("uuid");
const db      = require("../db");

const router = express.Router();

// ── Ensure files directory exists ─────────────────────────────────────────────
const FILES_DIR = path.join(process.env.DATA_DIR || path.join(__dirname, "../../data"), "files");
if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR, { recursive: true });

// ── Ensure files table exists ─────────────────────────────────────────────────
db.prepare(`
  CREATE TABLE IF NOT EXISTS files (
    id           TEXT PRIMARY KEY,
    original_name TEXT NOT NULL,
    mime_type    TEXT NOT NULL,
    size         INTEGER NOT NULL,
    property_id  TEXT,
    task_id      TEXT,
    uploaded_at  TEXT NOT NULL DEFAULT (datetime('now'))
  )
`).run();

// ── Multer config — store with UUID filename, preserve extension ──────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, FILES_DIR),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uuid() + ext);
  },
});

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
  },
});

// ── POST /api/files/upload ─────────────────────────────────────────────────────
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file provided" });

  const { property_id, task_id } = req.body;
  const id = path.basename(req.file.filename, path.extname(req.file.filename));

  // Re-use the UUID that multer generated as the file's ID
  db.prepare(`
    INSERT INTO files (id, original_name, mime_type, size, property_id, task_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, req.file.originalname, req.file.mimetype, req.file.size, property_id || null, task_id || null);

  res.status(201).json({
    id,
    originalName: req.file.originalname,
    mimeType:     req.file.mimetype,
    size:         req.file.size,
    uploadedAt:   new Date().toISOString(),
  });
});

// ── GET /api/files/:id ─────────────────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM files WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "File not found" });

  const ext      = path.extname(row.original_name).toLowerCase();
  const filePath = path.join(FILES_DIR, row.id + ext);

  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File missing from disk" });

  res.setHeader("Content-Type", row.mime_type);
  res.setHeader("Content-Disposition", `inline; filename="${row.original_name}"`);
  res.sendFile(filePath);
});

// ── GET /api/files/:id/download ───────────────────────────────────────────────
router.get("/:id/download", (req, res) => {
  const row = db.prepare("SELECT * FROM files WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "File not found" });

  const ext      = path.extname(row.original_name).toLowerCase();
  const filePath = path.join(FILES_DIR, row.id + ext);

  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File missing from disk" });

  res.setHeader("Content-Disposition", `attachment; filename="${row.original_name}"`);
  res.sendFile(filePath);
});

// ── DELETE /api/files/:id ─────────────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM files WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "File not found" });

  const ext      = path.extname(row.original_name).toLowerCase();
  const filePath = path.join(FILES_DIR, row.id + ext);

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  db.prepare("DELETE FROM files WHERE id = ?").run(req.params.id);

  res.json({ ok: true });
});

module.exports = router;
