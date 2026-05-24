const pool = require('../config/db');

// GET /api/saved-plans  — list all plans for the logged-in user
async function getAll(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT id, calories, created_at, plan_data FROM saved_plans WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// POST /api/saved-plans  — save a plan for the logged-in user
async function save(req, res, next) {
  try {
    const { plan } = req.body;
    if (!plan) return res.status(400).json({ error: 'plan is required' });

    const result = await pool.query(
      'INSERT INTO saved_plans (user_id, plan_data, calories) VALUES ($1, $2, $3) RETURNING id, created_at',
      [req.user.userId, JSON.stringify(plan), plan.totals?.calories || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/saved-plans/:id  — delete one of the user's saved plans
async function remove(req, res, next) {
  try {
    const result = await pool.query(
      'DELETE FROM saved_plans WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Plan not found' });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, save, remove };
