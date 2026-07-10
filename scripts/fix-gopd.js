#!/usr/bin/env node

/**
 * Ensures gopd's gOPD.js exists with the exact casing required on Linux.
 * macOS/Windows can hide this mismatch; Vercel (Linux) cannot.
 */
const fs = require('fs');
const path = require('path');

const gopdDir = path.join(__dirname, '..', 'node_modules', 'gopd');
const target = path.join(gopdDir, 'gOPD.js');
const source = `'use strict';\n\n/** @type {import('./gOPD')} */\nmodule.exports = Object.getOwnPropertyDescriptor;\n`;

if (!fs.existsSync(gopdDir)) {
  process.exit(0);
}

const entries = fs.readdirSync(gopdDir);
const match = entries.find((name) => name.toLowerCase() === 'gopd.js');

if (match && match !== 'gOPD.js') {
  // Case-only rename is unreliable on case-insensitive disks; rewrite the file.
  const wrongPath = path.join(gopdDir, match);
  const contents = fs.readFileSync(wrongPath, 'utf8');
  fs.writeFileSync(path.join(gopdDir, 'gOPD.tmp.js'), contents);
  fs.unlinkSync(wrongPath);
  fs.renameSync(path.join(gopdDir, 'gOPD.tmp.js'), target);
  console.log(`[fix-gopd] Renamed ${match} -> gOPD.js`);
} else if (!fs.existsSync(target)) {
  fs.writeFileSync(target, source);
  console.log('[fix-gopd] Created missing gOPD.js');
} else {
  console.log('[fix-gopd] gOPD.js OK');
}
