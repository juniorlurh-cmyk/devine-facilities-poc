// Backend client for the Google Apps Script web app (see backend/SETUP.md).
// When VITE_SHEETS_API_URL is unset the site runs fully static — every
// function degrades gracefully so nothing breaks before setup is done.

const API_URL = (import.meta.env.VITE_SHEETS_API_URL || '').trim();

export const hasBackend = () => API_URL.length > 0;

async function get(params) {
  const sep = API_URL.includes('?') ? '&' : '?';
  const res = await fetch(`${API_URL}${sep}${new URLSearchParams(params)}`);
  return res.json();
}

// POST as text/plain so the browser skips the CORS preflight — Apps
// Script accepts it and we JSON.parse server-side.
async function post(body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export const pingBackend = () => get({ action: 'ping' });

export const fetchSiteData = async () => {
  if (!hasBackend()) return null;
  try {
    const data = await get({ action: 'content' });
    if (data && !data.error) return data; // { content: {...}, sites: [...] }
  } catch { /* fall through */ }
  return null;
};

// Public read of ops data for /portal — returns only sites flagged
// visibility=demo/public so real client data is never exposed.
export const fetchOps = async () => {
  if (!hasBackend()) return null;
  try {
    const data = await get({ action: 'ops' });
    if (data && !data.error) return data; // { sites, tasks, worklogs, issues }
  } catch { /* fall through */ }
  return null;
};

export const submitLead = (lead) =>
  hasBackend()
    ? post({ action: 'lead', ...lead })
    : Promise.resolve({ error: 'no-backend' });

const ADMIN_KEY = () => sessionStorage.getItem('devine_admin_key') || '';

export const adminLogin = (key) =>
  post({ action: 'admin', op: 'auth', key }).then((r) => {
    if (r.ok) sessionStorage.setItem('devine_admin_key', key);
    return r;
  });

export const adminLogout = () => sessionStorage.removeItem('devine_admin_key');
export const isAdminAuthed = () => !!sessionStorage.getItem('devine_admin_key');

export const adminOp = (op, payload = {}) =>
  post({ action: 'admin', op, key: ADMIN_KEY(), ...payload });

// ---- CMS helpers -------------------------------------------------------

// Content override lookup: content['service.landscaping.tag'] etc.
export const contentGet = (content, key, fallback = '') =>
  content && content[key] != null && content[key] !== '' ? content[key] : fallback;

export const svcOverride = (content, id, field, fallback) =>
  contentGet(content, `service.${id}.${field}`, fallback);
