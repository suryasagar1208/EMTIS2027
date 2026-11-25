import http from 'node:http';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  GANESHA_OPENING_GREETING,
  generateGaneshaReply,
} from './ganesha/assistant.mjs';
import { BROCHURE_CHUNKS } from './rag/brochureKnowledge.mjs';

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

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PORT = Number(process.env.API_PORT || 3001);

const VALID_CATEGORIES = new Map([
  ['faculty', { label: 'Faculty / Academicians', early: '₹2,500', regular: '₹3,000' }],
  ['industry', { label: 'Industry Professionals', early: '₹3,500', regular: '₹4,000' }],
  ['scholars', { label: 'Research Scholars / PG', early: '₹1,500', regular: '₹2,000' }],
  ['ug', { label: 'UG Students', early: '₹800', regular: '₹1,000' }],
  ['attendee', { label: 'Non-presenting Co-author / Attendee', early: '₹500', regular: '₹500' }],
]);

const VALID_TRACKS = new Set(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'NONE']);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function ensureDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : [],
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    const initial = { registrations: [], inquiries: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

async function saveDb(db) {
  const tmpFile = `${DB_FILE}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(db, null, 2), 'utf8');
  await fs.rename(tmpFile, DB_FILE);
}

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

function validateRegistration(input) {
  const errors = {};
  const fullName = String(input.fullName ?? '').trim();
  const email = String(input.email ?? '').trim().toLowerCase();
  const phone = String(input.phone ?? '').trim();
  const affiliation = String(input.affiliation ?? '').trim();
  const categoryId = String(input.categoryId ?? '').trim();
  const participationType = String(input.participationType ?? 'presenter').trim();
  const trackCode = String(input.trackCode ?? 'T1').trim();
  const paperTitle = String(input.paperTitle ?? '').trim();
  const accommodationRequested = Boolean(input.accommodationRequested);

  if (fullName.length < 2 || fullName.length > 120) {
    errors.fullName = 'Please enter your full name (2–120 characters).';
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = 'Please enter a valid phone number (10–15 digits).';
  }
  if (affiliation.length < 2 || affiliation.length > 160) {
    errors.affiliation = 'Please enter your institution or organisation.';
  }
  if (!VALID_CATEGORIES.has(categoryId)) {
    errors.categoryId = 'Please select a valid registration category.';
  }
  if (participationType !== 'presenter' && participationType !== 'attendee') {
    errors.participationType = 'Please select a valid participation type.';
  }
  if (participationType === 'presenter' && (!VALID_TRACKS.has(trackCode) || trackCode === 'NONE')) {
    errors.trackCode = 'Please select a technical track (T1–T8) for presentation.';
  }
  if (participationType === 'presenter' && paperTitle.length > 0 && paperTitle.length < 5) {
    errors.paperTitle = 'Paper title must be at least 5 characters if provided.';
  }

  return {
    errors,
    cleaned: {
      fullName,
      email,
      phone,
      affiliation,
      categoryId,
      participationType,
      trackCode: participationType === 'attendee' ? 'NONE' : trackCode,
      paperTitle,
      accommodationRequested,
    },
  };
}

function validateInquiry(input) {
  const errors = {};
  const name = String(input.name ?? '').trim();
  const email = String(input.email ?? '').trim().toLowerCase();
  const affiliation = String(input.affiliation ?? '').trim();
  const subject = String(input.subject ?? '').trim();
  const message = String(input.message ?? '').trim();

  if (name.length < 2 || name.length > 120) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address so the Convenor can reply.';
  }
  if (subject.length < 3 || subject.length > 140) {
    errors.subject = 'Please select or enter an enquiry subject.';
  }
  if (message.length < 10 || message.length > 2000) {
    errors.message = 'Please enter an enquiry message (10–2000 characters).';
  }

  return {
    errors,
    cleaned: { name, email, affiliation, subject, message },
  };
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
      const { errors, cleaned } = validateRegistration(body);
      if (Object.keys(errors).length > 0) {
        return sendJson(res, 400, {
          ok: false,
          message: 'Please review the highlighted registration fields.',
          errors,
        });
      }

      const db = await ensureDb();
      const duplicate = db.registrations.find(
        (item) => item.email === cleaned.email && item.categoryId === cleaned.categoryId
      );
      if (duplicate) {
        return sendJson(res, 409, {
          ok: false,
          message: `A registration record for ${cleaned.email} under this category already exists (Ref: ${duplicate.referenceId}).`,
          referenceId: duplicate.referenceId,
        });
      }

      const feeMeta = VALID_CATEGORIES.get(cleaned.categoryId);
      const referenceId = `ETIMS27-REG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const record = {
        referenceId,
        ...cleaned,
        categoryLabel: feeMeta.label,
        earlyFeeInr: feeMeta.early,
        regularFeeInr: feeMeta.regular,
        paymentStatus: 'Pending official portal & payment confirmation',
        createdAt: new Date().toISOString(),
      };

      db.registrations.push(record);
      await saveDb(db);

      return sendJson(res, 201, {
        ok: true,
        message: 'Delegate pre-registration recorded successfully.',
        registration: {
          referenceId: record.referenceId,
          fullName: record.fullName,
          email: record.email,
          categoryLabel: record.categoryLabel,
          earlyFeeInr: record.earlyFeeInr,
          regularFeeInr: record.regularFeeInr,
          trackCode: record.trackCode,
          accommodationRequested: record.accommodationRequested,
          paymentStatus: record.paymentStatus,
          createdAt: record.createdAt,
        },
      });
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
      const { errors, cleaned } = validateInquiry(body);
      if (Object.keys(errors).length > 0) {
        return sendJson(res, 400, {
          ok: false,
          message: 'Please correct the highlighted enquiry fields.',
          errors,
        });
      }

      const db = await ensureDb();
      const referenceId = `ETIMS27-ENQ-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const record = {
        referenceId,
        ...cleaned,
        createdAt: new Date().toISOString(),
      };

      db.inquiries.push(record);
      await saveDb(db);

      return sendJson(res, 201, {
        ok: true,
        message: 'Your enquiry has been recorded for the Conference Convenor.',
        inquiry: {
          referenceId: record.referenceId,
          name: record.name,
          email: record.email,
          subject: record.subject,
          createdAt: record.createdAt,
        },
      });
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

