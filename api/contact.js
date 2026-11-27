import { createInquiryRecord } from '../server/lib/store.mjs';
import { parseRequestBody, sendJson } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, message: 'Method not allowed' });
  }

  try {
    const body = await parseRequestBody(req);
    const { status, payload } = await createInquiryRecord(body);
    return sendJson(res, status, payload);
  } catch (err) {
    return sendJson(res, 400, {
      ok: false,
      message: err instanceof Error ? err.message : 'Unable to process enquiry.',
    });
  }
}
