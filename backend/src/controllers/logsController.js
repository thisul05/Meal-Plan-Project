const pool = require('../config/db');

// GET /api/logs?date=YYYY-MM-DD
// Returns all log entries for the given date (defaults to today).
async function getByDate(req, res, next) {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const result = await pool.query(
      `SELECT * FROM logs WHERE user_id = $1 AND date = $2 ORDER BY created_at`,
      [req.user.userId, date]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
}

// GET /api/logs/summary?days=7
// Returns one row per day with total calories/macros — used for the weekly chart.
async function getSummary(req, res, next) {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 30);
    const result = await pool.query(
      `SELECT
         date::text,
         SUM(calories)::integer          AS calories,
         ROUND(SUM(protein)::numeric, 1) AS protein,
         ROUND(SUM(carbs)::numeric,   1) AS carbs,
         ROUND(SUM(fat)::numeric,     1) AS fat
       FROM logs
       WHERE user_id = $1
         AND date >= CURRENT_DATE - ($2 - 1) * INTERVAL '1 day'
       GROUP BY date
       ORDER BY date`,
      [req.user.userId, days]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
}

// POST /api/logs
// Body: { date?, recipe_id?, meal_slot, name, calories, protein, carbs, fat }
async function addLog(req, res, next) {
  try {
    const { date, recipe_id, meal_slot, name, calories, protein, carbs, fat } = req.body;

    if (!name || calories == null) {
      return res.status(400).json({ error: 'name and calories are required' });
    }

    const result = await pool.query(
      `INSERT INTO logs (user_id, date, recipe_id, meal_slot, name, calories, protein, carbs, fat)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.user.userId,
        date || new Date().toISOString().split('T')[0],
        recipe_id || null,
        meal_slot || null,
        name,
        calories,
        protein || 0,
        carbs    || 0,
        fat      || 0,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
}

// POST /api/logs/bulk
// Logs multiple meals at once (used by "Log All Meals" button).
async function addBulk(req, res, next) {
  try {
    const { meals, date } = req.body;
    if (!Array.isArray(meals) || !meals.length) {
      return res.status(400).json({ error: 'meals array is required' });
    }

    const logDate = date || new Date().toISOString().split('T')[0];
    const inserted = [];

    for (const m of meals) {
      const r = await pool.query(
        `INSERT INTO logs (user_id, date, recipe_id, meal_slot, name, calories, protein, carbs, fat)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [req.user.userId, logDate, m.recipe_id || null, m.meal_slot || null,
         m.name, m.calories, m.protein || 0, m.carbs || 0, m.fat || 0]
      );
      inserted.push(r.rows[0]);
    }
    res.status(201).json(inserted);
  } catch (err) { next(err); }
}

// DELETE /api/logs/:id
async function removeLog(req, res, next) {
  try {
    const result = await pool.query(
      `DELETE FROM logs WHERE id = $1 AND user_id = $2 RETURNING id`,
      [req.params.id, req.user.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Log entry not found' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
}

module.exports = { getByDate, getSummary, addLog, addBulk, removeLog };
