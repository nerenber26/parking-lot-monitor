// config/db.js

const { Pool } = require('pg');

// Database connection settings
const pool = new Pool({
  user: 'postgres',  // your username
  host: 'localhost',
  database: 'parking_lot_db',  // your database name
  password: 'password',  // your password
  port: 5432,
});

module.exports = pool;
