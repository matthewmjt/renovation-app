// server/routes/properties.js
const express = require("express");
const { v4: uuid } = require("uuid");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT id, data, updated_at FROM properties ORDER BY created_at DESC").all();
  const list = rows.map(r => {
    const d = JSON.parse(r.data);
    return { id: r.id, name: d.name, address: d.address, type: d.type, updatedAt: r.updated_at };
  });
  res.json(list);
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT data FROM properties WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(JSON.parse(row.data));
});

router.post("/", (req, res) => {
  const id = req.body.id || uuid();
  const data = { ...req.body, id };
  db.prepare("INSERT OR REPLACE INTO properties (id, data, updated_at) VALUES (?, ?, datetime('now'))").run(id, JSON.stringify(data));
  res.status(201).json(data);
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const data = { ...req.body, id };
  db.prepare("INSERT OR REPLACE INTO properties (id, data, updated_at) VALUES (?, ?, datetime('now'))").run(id, JSON.stringify(data));
  res.json(data);
});

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM properties WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
