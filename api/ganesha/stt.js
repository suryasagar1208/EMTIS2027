import { parseRequestBody, sendJson } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, message: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return sendJson(res, 400, {
      ok: false,
      message: 'Speech-to-text API fallback requires OPENAI_API_KEY in environment settings.',
    });
  }

  try {
    const body = await parseRequestBody(req, 6 * 1024 * 1024);
    const base64Audio = String(body.audioBase64 ?? '');
    const mimeType = String(body.mimeType ?? 'audio/webm');
    if (!base64Audio) {
      return sendJson(res, 400, { ok: false, message: 'Audio payload is required.' });
    }

    const audioBytes = Buffer.from(base64Audio, 'base64');
    const ext = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm';
    const form = new FormData();
    form.append('file', new Blob([audioBytes], { type: mimeType }), `speech.${ext}`);
    form.append('model', process.env.OPENAI_STT_MODEL || 'whisper-1');

    const sttRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: form,
    });

    if (!sttRes.ok) {
      return sendJson(res, 502, { ok: false, message: 'Speech transcription failed.' });
    }

    const data = await sttRes.json();
    return sendJson(res, 200, { ok: true, transcript: data.text || '' });
  } catch (err) {
    return sendJson(res, 400, {
      ok: false,
      message: err instanceof Error ? err.message : 'Unable to transcribe audio.',
    });
  }
}
