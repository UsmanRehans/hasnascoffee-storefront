#!/usr/bin/env node
/**
 * Hasna's Coffee - Shopify Theme Deploy Script
 * Uploads all theme files to a target theme via REST API
 * Usage: SHOPIFY_STORE=x.myshopify.com SHOPIFY_ACCESS_TOKEN=shpat_xxx node scripts/deploy.js [theme_id]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const STORE = process.env.SHOPIFY_STORE || 'y0ngah-e1.myshopify.com';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const THEME_ID = process.argv[2] || process.env.SHOPIFY_PROD_THEME_ID || '147639107745';

if (!TOKEN) {
  console.error('❌  SHOPIFY_ACCESS_TOKEN env var is required');
  process.exit(1);
}

// All theme folders to upload
const THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const ROOT_DIR = path.resolve(__dirname, '..');

// Binary file extensions (base64 encode these)
const BINARY_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot']);

function getFiles() {
  const files = [];
  for (const dir of THEME_DIRS) {
    const dirPath = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(dirPath)) continue;
    const entries = fs.readdirSync(dirPath);
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        files.push({ key: `${dir}/${entry}`, fullPath });
      }
    }
  }
  return files;
}

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: STORE,
      path: `/admin/api/2024-01${path}`,
      method,
      headers: {
        'X-Shopify-Access-Token': TOKEN,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function uploadFile(key, fullPath) {
  const ext = path.extname(fullPath).toLowerCase();
  const isBinary = BINARY_EXTS.has(ext);
  const fileBuffer = fs.readFileSync(fullPath);
  const value = isBinary
    ? fileBuffer.toString('base64')
    : fileBuffer.toString('utf8');

  const body = isBinary
    ? { asset: { key, attachment: value } }
    : { asset: { key, value } };

  const res = await apiRequest('PUT', `/themes/${THEME_ID}/assets.json`, body);

  if (res.status === 200 || res.status === 201) {
    return { ok: true, key };
  } else {
    return { ok: false, key, error: res.data?.errors || res.data };
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`\n🚀  Deploying to ${STORE} → theme ${THEME_ID}\n`);

  const files = getFiles();
  console.log(`📁  Found ${files.length} files to upload\n`);

  let ok = 0, fail = 0;
  const BATCH = 3; // upload 3 at a time to avoid rate limits

  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const results = await Promise.all(batch.map((f) => uploadFile(f.key, f.fullPath)));
    for (const r of results) {
      if (r.ok) {
        console.log(`  ✅  ${r.key}`);
        ok++;
      } else {
        console.error(`  ❌  ${r.key} - ${JSON.stringify(r.error)}`);
        fail++;
      }
    }
    // Brief pause to respect Shopify's API rate limit (40 req/sec bucket)
    if (i + BATCH < files.length) await sleep(200);
  }

  console.log(`\n${ok} uploaded, ${fail} failed`);
  if (fail > 0) process.exit(1);
  console.log('\n✨  Deploy complete!\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
