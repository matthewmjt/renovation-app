// server/routes/properties.js
const express = require("express");
const { v4: uuid } = require("uuid");
const db = require("../db");

const router = express.Router();

// GET /api/properties — list all (returns lightweight list, not full blobs)
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT id, data, updated_at FROM properties ORDER BY created_at DESC").all();
  const list = rows.map(r => {
    const d = JSON.parse(r.data);
    return { id: r.id, name: d.name, address: d.address, type: d.type, updatedAt: r.updated_at };
  });
  res.json(list);
});

// GET /api/properties/:id — full property data
router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT data FROM properties WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(JSON.parse(row.data));
});

// POST /api/properties — create new
router.post("/", (req, res) => {
  const id = uuid();
  const data = { ...req.body, id };
  db.prepare(`
    INSERT INTO properties (id, data) VALUES (?, ?)
  `).run(id, JSON.stringify(data));
  res.status(201).json(data);
});

// PUT /api/properties/:id — replace full property (entire state blob)
router.put("/:id", (req, res) => {
  const exists = db.prepare("SELECT id FROM properties WHERE id = ?").get(req.params.id);
  if (!exists) return res.status(404).json({ error: "Not found" });

  const data = { ...req.body, id: req.params.id };
  db.prepare(`
    UPDATE properties SET data = ?, updated_at = datetime('now') WHERE id = ?
  `).run(JSON.stringify(data), req.params.id);
  res.json(data);
});

// DELETE /api/properties/:id
router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM properties WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
