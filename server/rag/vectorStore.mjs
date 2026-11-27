import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BROCHURE_CHUNKS } from './brochureKnowledge.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUNDLED_VECTOR_FILE = path.join(__dirname, '..', 'data', 'vector_store.json');
const TMP_VECTOR_FILE = path.join(os.tmpdir(), 'etims-2027-vector-store.json');

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function fetchEmbeddingsBatch(inputs, apiKey, model) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: inputs,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI Embeddings error (${res.status}): ${errText}`);
  }
  const data = await res.json();
  return data.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

let cachedVectorIndex = null;

async function readVectorCache(filePath, embeddingModel) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (
      parsed.model === embeddingModel &&
      Array.isArray(parsed.chunks) &&
      parsed.chunks.length === BROCHURE_CHUNKS.length
    ) {
      return parsed.chunks;
    }
  } catch {
    // File missing or invalid
  }
  return null;
}

async function writeVectorCache(payload) {
  const targets = process.env.VERCEL
    ? [TMP_VECTOR_FILE]
    : [BUNDLED_VECTOR_FILE, TMP_VECTOR_FILE];

  for (const target of targets) {
    try {
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, JSON.stringify(payload), 'utf8');
      return;
    } catch {
      // Read-only filesystem (e.g., EROFS in serverless bundle); try next target
    }
  }
}

async function ensureOpenAIVectorIndex(apiKey, embeddingModel) {
  if (cachedVectorIndex) return cachedVectorIndex;

  const fromBundle = await readVectorCache(BUNDLED_VECTOR_FILE, embeddingModel);
  if (fromBundle) {
    cachedVectorIndex = fromBundle;
    return cachedVectorIndex;
  }

  const fromTmp = await readVectorCache(TMP_VECTOR_FILE, embeddingModel);
  if (fromTmp) {
    cachedVectorIndex = fromTmp;
    return cachedVectorIndex;
  }

  // Batch all brochure chunks into a single embeddings API request to avoid cold-start timeouts
  const inputs = BROCHURE_CHUNKS.map((chunk) => `${chunk.topic}\n${chunk.text}`);
  const embeddings = await fetchEmbeddingsBatch(inputs, apiKey, embeddingModel);
  const vectors = BROCHURE_CHUNKS.map((chunk, idx) => ({
    id: chunk.id,
    embedding: embeddings[idx],
  }));

  await writeVectorCache({ model: embeddingModel, chunks: vectors });
  cachedVectorIndex = vectors;
  return cachedVectorIndex;
}

function scoreLexicalChunk(query, chunk) {
  const qLower = query.toLowerCase();
  const qTokens = tokenize(query);
  const bodyTokens = new Set(tokenize(`${chunk.topic} ${chunk.text}`));
  let score = 0;

  for (const kw of chunk.keywords) {
    if (qLower.includes(kw)) {
      score += kw.includes(' ') ? 4.5 : 3.0;
    }
  }

  for (const token of qTokens) {
    if (bodyTokens.has(token)) {
      score += 1.25;
    }
  }

  return score;
}

/**
 * Retrieves top relevant brochure PDF chunks using OpenAI vector embeddings
 * when OPENAI_API_KEY is available, or lexical PDF RAG scoring otherwise.
 */
export async function retrieveRelevantBrochureChunks(query, options = {}) {
  const topK = options.topK ?? 3;
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

  if (apiKey) {
    try {
      const index = await ensureOpenAIVectorIndex(apiKey, embeddingModel);
      const [qVec] = await fetchEmbeddingsBatch([query], apiKey, embeddingModel);
      const scored = BROCHURE_CHUNKS.map((chunk, idx) => {
        const vectorSim = cosineSimilarity(qVec, index[idx].embedding);
        const lexBoost = Math.min(scoreLexicalChunk(query, chunk) * 0.02, 0.18);
        return {
          chunk,
          score: vectorSim + lexBoost,
          mode: 'openai-vector',
        };
      }).sort((a, b) => b.score - a.score);

      return scored.slice(0, topK);
    } catch (err) {
      console.warn('Vector retrieval fallback to lexical RAG:', err.message);
    }
  }

  const scored = BROCHURE_CHUNKS.map((chunk) => ({
    chunk,
    score: scoreLexicalChunk(query, chunk),
    mode: 'pdf-lexical-rag',
  })).sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}
