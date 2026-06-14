const pool = require('../config/db');

// GET /api/weight?days=30
async function getWeight(req, res, next) {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 365);
    const result = await pool.query(
      `SELECT id, date::text, weight_kg::float
       FROM weight_logs
       WHERE user_id = $1
         AND date >= CURRENT_DATE - ($2 - 1) * INTERVAL '1 day'
       ORDER BY date ASC`,
      [req.user.userId, days]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
}

// POST /api/weight  — upserts (one entry per user per day)
// Body: { date?, weight_kg }
async function logWeight(req, res, next) {
  try {
    const { weight_kg, date } = req.body;
    if (weight_kg == null || isNaN(weight_kg)) {
      return res.status(400).json({ error: 'weight_kg is required' });
    }
    const logDate = date || new Date().toISOString().split('T')[0];
    const result = await pool.query(
      `INSERT INTO weight_logs (user_id, date, weight_kg)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, date) DO UPDATE SET weight_kg = EXCLUDED.weight_kg
       RETURNING id, date::text, weight_kg::float`,
      [req.user.userId, logDate, weight_kg]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
}

// DELETE /api/weight/:id
async function deleteWeight(req, res, next) {
  try {
    const result = await pool.query(
      `DELETE FROM weight_logs WHERE id = $1 AND user_id = $2 RETURNING id`,
      [req.params.id, req.user.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Entry not found' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
}

module.exports = { getWeight, logWeight, deleteWeight };
