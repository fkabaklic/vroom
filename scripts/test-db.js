#!/usr/bin/env node

require('dotenv').config();
const mariadb = require('mariadb/callback');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 3306,
  connectTimeout: 15000,
};

if (process.env.DB_SSL === 'true') {
  config.ssl = { rejectUnauthorized: true };
}

console.log('Testing MariaDB connection...');
console.log('Host:', config.host);
console.log('Port:', config.port);
console.log('Database:', config.database);
console.log('User:', config.user);
console.log('SSL:', process.env.DB_SSL === 'true' ? 'enabled' : 'disabled');
console.log('');

const conn = mariadb.createConnection(config);
const start = Date.now();

conn.connect((err) => {
  const elapsed = Date.now() - start;

  if (err) {
    console.error(`FAILED (${elapsed}ms)`);
    console.error('Error:', err.message);
    console.error('Code:', err.code || 'N/A');
    process.exit(1);
  }

  console.log(`Connected (${elapsed}ms)`);

  conn.query('SHOW TABLES', (err2, tables) => {
    if (err2) {
      console.error('SHOW TABLES failed:', err2.message);
      conn.end();
      process.exit(1);
    }

    const names = tables.map((row) => Object.values(row)[0]);
    console.log(`Tables (${names.length}):`, names.join(', ') || '(none)');

    if (!names.includes('vehicle')) {
      console.warn('Warning: vehicle table not found. Run database/schema.sql and database/seed.sql.');
      conn.end();
      process.exit(1);
    }

    conn.query('SELECT COUNT(*) AS count FROM vehicle WHERE featured = 1', (err3, rows) => {
      if (err3) {
        console.error('Featured vehicle query failed:', err3.message);
        conn.end();
        process.exit(1);
      }

      console.log('Featured vehicles:', rows[0].count);
      conn.end();
      process.exit(0);
    });
  });
});
