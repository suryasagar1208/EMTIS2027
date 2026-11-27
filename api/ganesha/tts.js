import { parseRequestBody, sendJson } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, message: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return sendJson(res, 200, {
      ok: false,
      fallback: 'browser-tts',
    });
  }

  try {
    const body = await parseRequestBody(req, 32 * 1024);
    const text = String(body.text ?? '').trim().slice(0, 1800);
    if (!text) {
      return sendJson(res, 400, { ok: false, message: 'Text is required for speech.' });
    }

    const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL || 'tts-1',
        voice: process.env.OPENAI_TTS_VOICE || 'nova',
        input: text,
        response_format: 'mp3',
      }),
    });

    if (!ttsRes.ok) {
      return sendJson(res, 200, { ok: false, fallback: 'browser-tts' });
    }

    const audioBuffer = Buffer.from(await ttsRes.arrayBuffer());
    res.statusCode = 200;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'no-store');
    return res.end(audioBuffer);
  } catch {
    return sendJson(res, 200, { ok: false, fallback: 'browser-tts' });
  }
}
