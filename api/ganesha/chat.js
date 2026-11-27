import { generateGaneshaReply } from '../../server/ganesha/assistant.mjs';
import { parseRequestBody, sendJson } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, message: 'Method not allowed' });
  }

  try {
    const body = await parseRequestBody(req, 128 * 1024);
    const message = String(body.message ?? '').trim();
    if (!message || message.length > 1000) {
      return sendJson(res, 400, {
        ok: false,
        message: 'Please enter or speak a question (1–1000 characters).',
      });
    }

    const result = await generateGaneshaReply({
      message,
      history: body.history,
      preferredLanguage: body.language || 'auto',
    });

    return sendJson(res, 200, {
      ok: true,
      ...result,
    });
  } catch (err) {
    return sendJson(res, 500, {
      ok: false,
      message: err instanceof Error ? err.message : 'Unable to generate response.',
    });
  }
}
