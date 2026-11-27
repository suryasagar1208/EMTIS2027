import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_FILE = path.join(__dirname, '..', 'data', 'db.json');
const TMP_DB_FILE = path.join(os.tmpdir(), 'etims-2027-db.json');

export const VALID_CATEGORIES = new Map([
  ['faculty', { label: 'Faculty / Academicians', early: '₹2,500', regular: '₹3,000' }],
  ['industry', { label: 'Industry Professionals', early: '₹3,500', regular: '₹4,000' }],
  ['scholars', { label: 'Research Scholars / PG', early: '₹1,500', regular: '₹2,000' }],
  ['ug', { label: 'UG Students', early: '₹800', regular: '₹1,000' }],
  ['attendee', { label: 'Non-presenting Co-author / Attendee', early: '₹500', regular: '₹500' }],
]);

const VALID_TRACKS = new Set(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'NONE']);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getDbPath() {
  return process.env.VERCEL ? TMP_DB_FILE : LOCAL_DB_FILE;
}

export async function ensureDb() {
  const dbPath = getDbPath();
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      registrations: Array.isArray(parsed.registrations) ? parsed.registrations : [],
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    // Seed from bundled local db.json on cold start if running in serverless /tmp
    if (dbPath === TMP_DB_FILE) {
      try {
        const bundled = JSON.parse(await fs.readFile(LOCAL_DB_FILE, 'utf8'));
        return {
          registrations: Array.isArray(bundled.registrations) ? bundled.registrations : [],
          inquiries: Array.isArray(bundled.inquiries) ? bundled.inquiries : [],
        };
      } catch {
        // Ignore missing bundled db
      }
    }
    const initial = { registrations: [], inquiries: [] };
    await saveDb(initial);
    return initial;
  }
}

export async function saveDb(db) {
  const targets = process.env.VERCEL
    ? [TMP_DB_FILE]
    : [LOCAL_DB_FILE, TMP_DB_FILE];

  for (const target of targets) {
    try {
      await fs.mkdir(path.dirname(target), { recursive: true });
      const tmpFile = `${target}.${crypto.randomUUID()}.tmp`;
      await fs.writeFile(tmpFile, JSON.stringify(db, null, 2), 'utf8');
      await fs.rename(tmpFile, target);
      return;
    } catch {
      // Fallback to /tmp if local path is read-only
    }
  }
}

export function validateRegistration(input) {
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

export function validateInquiry(input) {
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

export async function createRegistrationRecord(body) {
  const { errors, cleaned } = validateRegistration(body);
  if (Object.keys(errors).length > 0) {
    return {
      status: 400,
      payload: {
        ok: false,
        message: 'Please review the highlighted registration fields.',
        errors,
      },
    };
  }

  const db = await ensureDb();
  const duplicate = db.registrations.find(
    (item) => item.email === cleaned.email && item.categoryId === cleaned.categoryId
  );
  if (duplicate) {
    return {
      status: 409,
      payload: {
        ok: false,
        message: `A registration record for ${cleaned.email} under this category already exists (Ref: ${duplicate.referenceId}).`,
        referenceId: duplicate.referenceId,
      },
    };
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

  return {
    status: 201,
    payload: {
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
    },
  };
}

export async function createInquiryRecord(body) {
  const { errors, cleaned } = validateInquiry(body);
  if (Object.keys(errors).length > 0) {
    return {
      status: 400,
      payload: {
        ok: false,
        message: 'Please correct the highlighted enquiry fields.',
        errors,
      },
    };
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

  return {
    status: 201,
    payload: {
      ok: true,
      message: 'Your enquiry has been recorded for the Conference Convenor.',
      inquiry: {
        referenceId: record.referenceId,
        name: record.name,
        email: record.email,
        subject: record.subject,
        createdAt: record.createdAt,
      },
    },
  };
}
