const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://main:12345678@localhost:5432/rewear'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};