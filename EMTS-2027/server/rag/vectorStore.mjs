import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BROCHURE_CHUNKS } from './brochureKnowledge.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VECTOR_CACHE_FILE = path.join(__dirname, '..', 'data', 'vector_store.json');

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

async function fetchEmbedding(text, apiKey, model) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: text,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI Embeddings error (${res.status}): ${errText}`);
  }
  const data = await res.json();
  return data.data[0].embedding;
}

let cachedVectorIndex = null;

async function ensureOpenAIVectorIndex(apiKey, embeddingModel) {
  if (cachedVectorIndex) return cachedVectorIndex;

  try {
    const raw = await fs.readFile(VECTOR_CACHE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (
      parsed.model === embeddingModel &&
      Array.isArray(parsed.chunks) &&
      parsed.chunks.length === BROCHURE_CHUNKS.length
    ) {
      cachedVectorIndex = parsed.chunks;
      return cachedVectorIndex;
    }
  } catch {
    // Cache not yet created
  }

  const vectors = [];
  for (const chunk of BROCHURE_CHUNKS) {
    const embedding = await fetchEmbedding(
      `${chunk.topic}\n${chunk.text}`,
      apiKey,
      embeddingModel
    );
    vectors.push({ id: chunk.id, embedding });
  }

  await fs.mkdir(path.dirname(VECTOR_CACHE_FILE), { recursive: true });
  await fs.writeFile(
    VECTOR_CACHE_FILE,
    JSON.stringify({ model: embeddingModel, chunks: vectors }),
    'utf8'
  );
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
      const qVec = await fetchEmbedding(query, apiKey, embeddingModel);
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

