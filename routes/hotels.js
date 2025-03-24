const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hotels');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/upcoming-bookings', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT  h.hotel_id,     h.name AS hotel_name,    r.room_type AS room_type,    r.room_number AS room_number,    COUNT(b.booking_id) AS total_booking_count,    COUNT(CASE WHEN b.check_in_date >= CURRENT_DATE THEN 1 END) AS upcoming_booking_count FROM     hotels h JOIN    rooms r ON h.hotel_id = r.hotel_id LEFT JOIN     bookings b ON r.room_id = b.room_id GROUP BY     h.hotel_id, h.name, r.room_id, r.room_type, r.room_number ORDER BY     h.name DESC;');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
