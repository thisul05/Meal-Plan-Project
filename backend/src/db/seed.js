// Reads every .sql file in seeds/ in alphabetical order and executes it.
// ON CONFLICT DO NOTHING in the SQL makes this idempotent (safe to re-run).

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function seed() {
  const seedsDir = path.join(__dirname, 'seeds');
  const files = fs.readdirSync(seedsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8');
      console.log(`Running seed: ${file}`);
      await client.query(sql);
      console.log(`  ✓ done`);
    }

    const count = await client.query('SELECT COUNT(*) FROM recipes');
    console.log(`\nSeed complete. Recipes in database: ${count.rows[0].count}`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
