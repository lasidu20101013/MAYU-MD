/**
 * Settings store - 𝐌𝐀𝐘𝐔 𝐌𝐃
 *
 * Keeps users, groups, bot settings, lists and per-session settings in
 * MongoDB (collection "bot_store"). It replaces the old Firebase adapter,
 * which needed a separate Firebase account and never loaded saved data back
 * after a restart (every redeploy started with empty settings).
 *
 * Same API as before: init, get, set, update, flush, shutdown, isReady...
 * Values are stored as JSON text so keys like "9477...@s.whatsapp.net"
 * (which contain dots) are always safe.
 */
const { MongoClient } = require('mongodb');
const config = require('../config');

const KEYS = ['user', 'premium', 'banned', 'admin', 'groups', 'settings', 'sessions'];
const defaults = { user: {}, premium: [], banned: [], admin: [], groups: {}, settings: {}, sessions: {} };

const cache = new Map();
const dirty = new Set();
let client = null, collection = null;
let flushTimer = null, debounceTimer = null;
let ready = false, lastError = null;

function defaultFor(key) {
  return JSON.parse(JSON.stringify(key in defaults ? defaults[key] : {}));
}

function get(key) {
  if (!cache.has(key)) cache.set(key, defaultFor(key));
  return cache.get(key);
}

function set(key, value, immediate = false) {
  cache.set(key, value);
  dirty.add(key);
  if (immediate) return flush(true);
  schedule();
  return value;
}

function update(key, mutator, immediate = false) {
  const value = get(key);
  const result = mutator(value);
  /* Some callers return a new array instead of mutating (e.g. filter). */
  if (Array.isArray(value) && Array.isArray(result)) cache.set(key, result);
  dirty.add(key);
  if (immediate) return flush(true);
  schedule();
  return result;
}

function schedule() {
  if (debounceTimer) return;
  debounceTimer = setTimeout(async () => {
    debounceTimer = null;
    try { await flush(false); } catch (e) { console.error('[STORE] debounce flush:', e.message); }
  }, config.MONGODB_FLUSH_MS || 5000);
  debounceTimer.unref?.();
}

async function flush(force = false) {
  if (!ready || !collection || !dirty.size) return;
  const keys = [...dirty];
  dirty.clear();
  try {
    await Promise.all(keys.map(key => collection.updateOne(
      { _id: key },
      { $set: { json: JSON.stringify(get(key)), updatedAt: new Date().toISOString() } },
      { upsert: true }
    )));
  } catch (e) {
    keys.forEach(k => dirty.add(k));
    lastError = { code: 'STORE_WRITE_FAILED', human: e.message, fix: ['Check MongoDB network access and credentials.'] };
    if (force) throw e;
  }
}

async function init() {
  const uri = String(config.MONGODB_URI || '').trim();
  if (!uri) {
    lastError = { code: 'MONGODB_NOT_CONFIGURED', human: 'MONGODB_URI is not configured.', fix: ['Set MONGODB_URI to your MongoDB connection string.'] };
    throw new Error(lastError.code);
  }
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000, connectTimeoutMS: 15000 });
  await client.connect();
  collection = client.db(config.MONGODB_DB || 'mayu-md').collection('bot_store');
  /* Load everything that was saved before (the old Firebase code skipped this). */
  const docs = await collection.find({}).toArray();
  for (const key of KEYS) {
    const doc = docs.find(d => d._id === key);
    let value = defaultFor(key);
    if (doc && typeof doc.json === 'string') {
      try { value = JSON.parse(doc.json); } catch (_) {}
    }
    cache.set(key, value);
  }
  ready = true;
  lastError = null;
  console.log(`[STORE] Connected -> ${config.MONGODB_DB || 'mayu-md'}.bot_store`);
  flushTimer = setInterval(() => flush(false).catch(() => {}), config.MONGODB_FLUSH_MS || 5000);
  flushTimer.unref?.();
}

async function shutdown() {
  await flush(true).catch(() => {});
  if (flushTimer) clearInterval(flushTimer);
  await client?.close().catch(() => {});
  ready = false;
}

const isReady = () => ready;
const getLastError = () => lastError;
const getStats = () => ({ ready, dirty: dirty.size, cached: cache.size, provider: 'mongodb', database: `${config.MONGODB_DB || 'mayu-md'}.bot_store` });

module.exports = { init, get, set, update, flush, shutdown, isReady, getLastError, getStats, KEYS, defaults };
