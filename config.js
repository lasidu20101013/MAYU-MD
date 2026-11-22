/**
 * ==========================================================
 *  𝐌𝐀𝐘𝐔 𝐌𝐃 - CENTRAL CONFIGURATION
 * ==========================================================
 */
require('dotenv').config();
const path = require('path');

const toBool = (v, d = false) => {
  if (v === undefined || v === null || v === '') return d;
  return String(v).toLowerCase() === 'true' || String(v) === '1';
};

const list = (v, d = []) => {
  if (!v) return d;
  return String(v).split(',').map(s => s.replace(/[^0-9]/g, '')).filter(Boolean);
};

module.exports = {
  /* ---------- IDENTITY ---------- */
  BOT_NAME: process.env.BOT_NAME || '𝐌𝐀𝐘𝐔 𝐌𝐃',
  BOT_NAME_PLAIN: process.env.BOT_NAME_PLAIN || 'MAYU MD',
  OWNER_NAME: process.env.OWNER_NAME || 'MAYU MD',
  // Your WhatsApp number (country code, no +). Only this number gets the
  // server-wide owner commands (restart, broadcast, sessions...).
  OWNER_NUMBER: String(process.env.OWNER_NUMBER || '94743519654').replace(/[^0-9]/g, ''),
  OWNER_NUMBERS: list(process.env.OWNER_NUMBERS || process.env.OWNER_NUMBER || '94743519654', []),
  FOOTER: process.env.FOOTER || ((process.env.PUBLIC_URL ? `*🤖 Get your own bot:*\n${process.env.PUBLIC_URL}\n\n` : '') + '> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀʏᴜ ᴍᴅ*'),
  // Bot logo (used in WhatsApp messages, the menu and the website)
  LOGO: process.env.LOGO || 'https://res.cloudinary.com/jhyyuaca/image/upload/v1795367524/w0cc2drnbvqnf6t1jnmg.jpg',
  // A web URL of the logo (used for link previews)
  LOGO_URL: process.env.LOGO || 'https://res.cloudinary.com/jhyyuaca/image/upload/v1795367524/w0cc2drnbvqnf6t1jnmg.jpg',
  // Image for the .menu command (default: the bot logo)
  MENU_LOGO: process.env.MENU_LOGO || process.env.LOGO || 'https://res.cloudinary.com/jhyyuaca/image/upload/v1795367524/w0cc2drnbvqnf6t1jnmg.jpg',
  // Your own support channel / group (optional - leave empty to disable)
  SUPPORT_CHANNEL: process.env.SUPPORT_CHANNEL || 'https://whatsapp.com/channel/0029Vb86SGl6rsQroaTEU42D',
  AUTO_JOIN_GROUP: toBool(process.env.AUTO_JOIN_GROUP, false),
  AUTO_JOIN_GROUP_LINK: process.env.AUTO_JOIN_GROUP_LINK || '',
  AUTO_REACT_CHANNELS: [],
  CHANNEL_JID: process.env.CHANNEL_JID || '',
  CHANNEL_NAME: process.env.CHANNEL_NAME || 'ᴍᴀʏᴜ ᴍᴅ',
  AUTO_FOLLOW_CHANNEL: toBool(process.env.AUTO_FOLLOW_CHANNEL, false),

  /* ---------- CORE ---------- */
  PREFIX: process.env.PREFIX || '.',
  MULTI_PREFIX: toBool(process.env.MULTI_PREFIX, true),
  PREFIX_LIST: (process.env.PREFIX_LIST || '.,!,#,/,$,&,+').split(','),
  DEBUG_DROPS: toBool(process.env.DEBUG_DROPS, true),
  MODE: process.env.MODE || 'public',            // public | private | group | inbox
  LANG: process.env.LANG_MODE || 'en',
  TIMEZONE: process.env.TZ || 'Asia/Colombo',
  PORT: process.env.PORT || 8000,
  /* Optional manual pin for the WhatsApp Web build, e.g. "2.3000.1042466098".
     Leave empty: the bot detects the live build itself (lib/waversion.js).
     Only set this if WhatsApp changes something and linking breaks. */
  WA_VERSION: process.env.WA_VERSION || '',
  // Keep the panel URL stable so WhatsApp and connection messages expose one URL.
  // Your bot's website address, e.g. https://mayu-md.onrender.com
  PUBLIC_URL: process.env.PUBLIC_URL || (process.env.RENDER_EXTERNAL_URL || ''),

  /* ---------- DATABASE ---------- */
  /* Everything is stored in MongoDB (sessions, logins, users, groups, settings) */
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGODB || '',
  MONGODB_DB: process.env.MONGODB_DB || 'mayu-md',
  MONGODB_IMPORT_LOCAL: toBool(process.env.MONGODB_IMPORT_LOCAL, true),
  MONGODB_FLUSH_MS: Number(process.env.MONGODB_FLUSH_MS || 5000),

  /* ---------- GROQ AI (powers the .support assistant) ---------- */
  /* Set GROQ_API_KEY as an environment variable / config var.
     Never commit a real key to the repository. */
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  /* Optional. Leave blank to auto-select a working model: Groq retires
     models often, so the client walks a fallback chain. */
  GROQ_MODEL: process.env.GROQ_MODEL || '',

  /* ---------- DOWNLOAD / AI API ----------
     Third-party API used by the download, movie, tempmail and AI commands.
     You can point these at another compatible API with API_BASE / API_KEY. */
  API_BASE: process.env.API_BASE || 'https://sasa-dev-api.xyz',
  MOVIE_API_BASE: process.env.MOVIE_API_BASE || process.env.MOVIE_API_BASE || 'https://chama-movie-api.koyeb.app',
  MOVIE_API_KEY: process.env.MOVIE_API_KEY || process.env.MOVIE_API_KEY || '',
  API_KEY: process.env.API_KEY || 'Sasa_Dev_Api_eee881211576a83ff302674dbc4c9b750ffeeccb',

  /* ---------- AUTOMATION TOGGLES ---------- */
  AUTO_READ_STATUS: toBool(process.env.AUTO_READ_STATUS, true),
  AUTO_LIKE_STATUS: toBool(process.env.AUTO_LIKE_STATUS, true),
  STATUS_EMOJI: process.env.STATUS_EMOJI || '💚',
  AUTO_READ_MESSAGES: toBool(process.env.AUTO_READ_MESSAGES, false),
  AUTO_TYPING: toBool(process.env.AUTO_TYPING, false),
  AUTO_RECORDING: toBool(process.env.AUTO_RECORDING, false),
  ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE, true),
  AUTO_REACT: toBool(process.env.AUTO_REACT, false),
  AUTO_BIO: toBool(process.env.AUTO_BIO, false),
  ANTI_DELETE: toBool(process.env.ANTI_DELETE, true),
  ANTI_CALL: toBool(process.env.ANTI_CALL, true),
  ANTI_CALL_BLOCK: toBool(process.env.ANTI_CALL_BLOCK, false),
  ANTI_LINK: toBool(process.env.ANTI_LINK, false),
  ANTI_BOT: toBool(process.env.ANTI_BOT, false),
  WELCOME: toBool(process.env.WELCOME, false),
  READ_CMD: toBool(process.env.READ_CMD, true),
  PRESENCE_UPDATE: process.env.PRESENCE_UPDATE || 'available',

  /* ---------- UI ---------- */
  SEND_LOGO_ON_MENU: toBool(process.env.SEND_LOGO_ON_MENU, true),
  NEWSLETTER_FORWARD: toBool(process.env.NEWSLETTER_FORWARD, true),
  REACT_ON_CMD: toBool(process.env.REACT_ON_CMD, true),
  CMD_REACTION: process.env.CMD_REACTION || '⚡',

  /* Every bot text reply is converted to the ᴀʙᴄᴅ small-caps Unicode
     "font" (lib/utils.js -> fontify). Disable with FONT_SMALLCAPS=false. */
  FONT_SMALLCAPS: toBool(process.env.FONT_SMALLCAPS, true),

  /* ---------- LIMITS ---------- */
  MAX_UPLOAD_MB: Number(process.env.MAX_UPLOAD_MB || 90),
  COOLDOWN_MS: Number(process.env.COOLDOWN_MS || 1200),
  // WhatsApp rotates the pairing ref at ~60s. Anything below ~50 cuts the
  // user off while they are still typing, so a floor is enforced here even
  // if an old deployment still sets PAIR_CODE_TTL=40.
  PAIR_CODE_TTL: Math.min(58, Math.max(50, Number(process.env.PAIR_CODE_TTL || 55))),
  SESSION_DIR: process.env.SESSION_DIR || './data/sessions',
  MAX_SESSIONS: Number(process.env.MAX_SESSIONS || 500),

  /* ---------- WEB ---------- */
  SITE_NAME: process.env.SITE_NAME || '𝐌𝐀𝐘𝐔 𝐌𝐃',
  API_RATE_LIMIT: Number(process.env.API_RATE_LIMIT || 30),

  /* Owner dashboard (/owner). Set OWNER_PANEL_PASSWORD, or use "Forgot
     password" on the panel to get a new one sent to your WhatsApp. */
  OWNER_PANEL_PASSWORD: process.env.OWNER_PANEL_PASSWORD || '',
  OWNER_PANEL_NUMBER: process.env.OWNER_PANEL_NUMBER || '',
  OWNER_PANEL_TOKEN_TTL: Number(process.env.OWNER_PANEL_TOKEN_TTL || 1800000)
};
