/**
 * Reads local .env file and saves values as env.local.json
 * Run: node scripts/get-env.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const outPath = path.join(__dirname, '..', 'env.local.json');

if (!fs.existsSync(envPath)) {
  console.error('.env file not found. Create one based on .env.example');
  process.exit(1);
}

const vars = {};
const lines = fs.readFileSync(envPath, 'utf8').split('\n');

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  if (key) vars[key.trim()] = rest.join('=').trim();
}

fs.writeFileSync(outPath, JSON.stringify(vars, null, 2));
console.log(`Saved ${Object.keys(vars).length} variables to env.local.json`);
console.log(JSON.stringify(vars, null, 2));
