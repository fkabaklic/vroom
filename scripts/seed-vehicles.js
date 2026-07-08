#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mariadb = require('mariadb/callback');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 3306,
  multipleStatements: true,
  connectTimeout: 15000,
};

const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'vehicles.sql'), 'utf8');
const conn = mariadb.createConnection(config);

conn.connect((err) => {
  if (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }

  console.log('Updating vehicles from public/images...');
  conn.query(sql, (err2) => {
    if (err2) {
      console.error('Failed to update vehicles:', err2.message);
      conn.end();
      process.exit(1);
    }

    conn.query(
      'SELECT vehicle_id, prodimage, description, featured FROM vehicle ORDER BY vehicle_id',
      (err3, rows) => {
        if (err3) {
          console.error('Failed to list vehicles:', err3.message);
          conn.end();
          process.exit(1);
        }

        console.log(`Loaded ${rows.length} vehicles:`);
        rows.forEach((row) => {
          console.log(` - ${row.vehicle_id}: ${row.prodimage} (${row.description})`);
        });
        conn.end();
      }
    );
  });
});
