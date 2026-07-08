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

if (process.env.DB_SSL === 'true') {
  config.ssl = { rejectUnauthorized: true };
}

function readSql(filename) {
  return fs.readFileSync(path.join(__dirname, '..', 'database', filename), 'utf8');
}

function runFile(conn, filename, callback) {
  const sql = readSql(filename);
  console.log(`Running ${filename}...`);
  conn.query(sql, (err) => {
    if (err) {
      console.error(`Failed while running ${filename}:`, err.message);
      callback(err);
      return;
    }
    console.log(`Finished ${filename}`);
    callback();
  });
}

console.log('Initializing Railway/MySQL database...');
console.log('Host:', config.host);
console.log('Database:', config.database);
console.log('');

const conn = mariadb.createConnection(config);

conn.connect((err) => {
  if (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }

  runFile(conn, 'schema.sql', (schemaErr) => {
    if (schemaErr) {
      conn.end();
      process.exit(1);
    }

    runFile(conn, 'seed.sql', (seedErr) => {
      conn.end();
      process.exit(seedErr ? 1 : 0);
    });
  });
});
