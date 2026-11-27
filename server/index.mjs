import http from 'node:http';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GANESHA_OPENING_GREETING,
  generateGaneshaReply,
} from './ganesha/assistant.mjs';
import { BROCHURE_CHUNKS } from './rag/brochureKnowledge.mjs';
import {
  createInquiryRecord,
  createRegistrationRecord,
  ensureDb,
} from './lib/store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

// Load .env if present (without overriding existing environment variables)
const envPath = path.join(ROOT_DIR, '.env');
if (fsSync.existsSync(envPath)) {
  const lines = fsSync.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && !(key in process.env)) {
      process.env[key] = val;
    }
  }
}

const PORT = Number(process.env.API_PORT || 3001);

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req, maxBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > maxBytes) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    const db = await ensureDb();
    return sendJson(res, 200, {
      status: 'ok',
      service: 'ETIMS 2027 Conference API',
      registrationsCount: db.registrations.length,
      inquiriesCount: db.inquiries.length,
    });
  }

  if (req.method === 'GET' && url.pathname === '/api/ganesha/status') {
    const hasKey = Boolean(process.env.OPENAI_API_KEY?.trim());
    return sendJson(res, 200, {
      ok: true,
      name: 'GANESHA',
      subtitle: 'Your Intelligent ETIMS 2027 Conference Assistant',
      greeting: GANESHA_OPENING_GREETING,
      openAiConfigured: hasKey,
      ragEngine: hasKey ? 'openai-vector-rag' : 'pdf-lexical-rag',
      knowledgeChunks: BROCHURE_CHUNKS.length,
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/ganesha/chat') {
    try {
      const body = await readJsonBody(req, 128 * 1024);
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

  if (req.method === 'POST' && url.pathname === '/api/ganesha/tts') {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return sendJson(res, 200, {
        ok: false,
        fallback: 'browser-tts',
      });
    }

    try {
      const body = await readJsonBody(req, 32 * 1024);
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
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Cache-Control': 'no-store',
      });
      return res.end(audioBuffer);
    } catch {
      return sendJson(res, 200, { ok: false, fallback: 'browser-tts' });
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/ganesha/stt') {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return sendJson(res, 400, {
        ok: false,
        message: 'Speech-to-text API fallback requires OPENAI_API_KEY in .env.',
      });
    }

    try {
      const body = await readJsonBody(req, 6 * 1024 * 1024);
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

  if (req.method === 'GET' && url.pathname === '/api/registrations/summary') {
    const db = await ensureDb();
    return sendJson(res, 200, {
      totalPreRegistrations: db.registrations.length,
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/registrations') {
    try {
      const body = await readJsonBody(req);
      const { status, payload } = await createRegistrationRecord(body);
      return sendJson(res, status, payload);
    } catch (err) {
      return sendJson(res, 400, {
        ok: false,
        message: err instanceof Error ? err.message : 'Unable to process registration.',
      });
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/contact') {
    try {
      const body = await readJsonBody(req);
      const { status, payload } = await createInquiryRecord(body);
      return sendJson(res, status, payload);
    } catch (err) {
      return sendJson(res, 400, {
        ok: false,
        message: err instanceof Error ? err.message : 'Unable to process enquiry.',
      });
    }
  }

  return sendJson(res, 404, { ok: false, message: 'API route not found.' });
});

ensureDb().then(() => {
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`ETIMS 2027 API server listening on http://127.0.0.1:${PORT}`);
  });
});
