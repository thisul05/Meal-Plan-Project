const { Pool } = require('pg');

// Pool manages a set of reusable connections — more efficient than
// opening a new connection for every query.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
