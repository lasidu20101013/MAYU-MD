const axios = require('axios');
const config = require('../config');
const client = axios.create({ baseURL: config.MOVIE_API_BASE, timeout: 90000, validateStatus: () => true, headers: { 'User-Agent': 'MayuMD/1.0' } });
async function request(path, params = {}) {
  const res = await client.get(path, { params: { ...params, api_key: config.MOVIE_API_KEY } });
  if (res.status >= 300) throw new Error(res.data?.message || `Movie API HTTP ${res.status}`);
  return res.data;
}
function urls(value, out = []) {
  if (typeof value === 'string' && /^https?:\/\//i.test(value)) out.push(value);
  else if (Array.isArray(value)) value.forEach(x => urls(x, out));
  else if (value && typeof value === 'object') Object.values(value).forEach(x => urls(x, out));
  return [...new Set(out)];
}
module.exports = { request, urls };
