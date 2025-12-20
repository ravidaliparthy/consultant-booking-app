import express from "express";
import { db } from "../db.js";

const router = express.Router();

/* Create slot */
router.post("/slots", (req, res) => {
  const { time } = req.body;
  if (!time) return res.status(400).json({ error: "Time is required" });

  db.run("INSERT INTO slots (time) VALUES (?)", [time], function () {
    res.json({ id: this.lastID, time, booked: 0 });
  });
});

/* List slots with pagination, search, filter */
router.get("/slots", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const search = req.query.search || "";
  const status = req.query.status;

  let where = "WHERE time LIKE ?";
  let params = [`%${search}%`];

  if (status === "available") where += " AND booked = 0";
  if (status === "booked") where += " AND booked = 1";

  db.all(
    `SELECT * FROM slots ${where} LIMIT ? OFFSET ?`,
    [...params, limit, offset],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      db.get(
        `SELECT COUNT(*) as total FROM slots ${where}`,
        params,
        (err, count) => {
          res.json({
            data: rows,
            page,
            totalPages: Math.ceil(count.total / limit)
          });
        }
      );
    }
  );
});

/* Book slot */
router.post("/book", (req, res) => {
  const { name, email, slotId } = req.body;
  if (!name || !email || !slotId)
    return res.status(400).json({ error: "All fields required" });

  db.get("SELECT booked FROM slots WHERE id = ?", [slotId], (err, slot) => {
    if (!slot || slot.booked)
      return res.status(400).json({ error: "Slot unavailable" });

    db.run(
      "INSERT INTO bookings (name, email, slot_id) VALUES (?, ?, ?)",
      [name, email, slotId],
      () => {
        db.run("UPDATE slots SET booked = 1 WHERE id = ?", [slotId]);
        res.json({ message: "Booking confirmed" });
      }
    );
  });
});

/* Cancel booking */
router.post("/cancel", (req, res) => {
  const { slotId } = req.body;
  if (!slotId) return res.status(400).json({ error: "slotId required" });

  db.run("DELETE FROM bookings WHERE slot_id = ?", [slotId]);
  db.run("UPDATE slots SET booked = 0 WHERE id = ?", [slotId]);

  res.json({ message: "Booking cancelled" });
});

/* Delete slot */
router.delete("/slots/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM bookings WHERE slot_id = ?", [id]);
  db.run("DELETE FROM slots WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Slot not found" });
    }

    res.json({ message: "Slot deleted successfully" });
  });
});

/* Delete slot */
router.delete("/slots/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM bookings WHERE slot_id = ?", [id]);
  db.run("DELETE FROM slots WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Slot not found" });
    }

    res.json({ message: "Slot deleted successfully" });
  });
});

export default router;
