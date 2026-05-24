const pool = require('../config/db');

// GET /api/recipes
async function getAll(_req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM recipes ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/recipes/:id
async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Recipe id must be a number' });
    }
    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById };
