import { ensureDb } from '../../server/lib/store.mjs';
import { sendJson } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { ok: false, message: 'Method not allowed' });
  }
  const db = await ensureDb();
  return sendJson(res, 200, {
    totalPreRegistrations: db.registrations.length,
  });
}
