
const axios = require('axios');
const config = require('../config');

const INTERVAL_MS = Number(process.env.KEEPALIVE_MS || 60000);   // 60 s default
const TIMEOUT_MS = 15000;

let timer = null;

function pingUrl() {
  const targets = [];
  /* Pinging the PUBLIC address is what keeps free hosts (Heroku/Render)
     awake; a localhost ping does not count as outside traffic. */
  if (config.PUBLIC_URL) targets.push(`${config.PUBLIC_URL.replace(/\/+$/, '')}/`);
  if (process.env.HEROKU_APP_NAME) targets.push(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com/`);
  if (process.env.PORT) targets.push(`http://localhost:${process.env.PORT}/`);
  return targets[0];
}

function start() {
  if (timer) return;
  const url = pingUrl();
  if (!url) { console.log('[KEEPALIVE] No PUBLIC_URL set - self ping disabled'); return; }
  console.log(`[KEEPALIVE] Anti-sleep ping every ${INTERVAL_MS / 1000}s -> ${url}`);
  timer = setInterval(async () => {
    try {
      await axios.get(url, { timeout: TIMEOUT_MS, validateStatus: () => true });
    } catch (e) {
      // Self ping failures must never surface to users; the WhatsApp
      // socket watchdog (connection.js) handles real reconnection.
      console.warn('[KEEPALIVE] self-ping skipped:', String(e.message).slice(0, 100));
    }
  }, INTERVAL_MS);
  timer.unref?.();
}

module.exports = { start, pingUrl };
