import { GANESHA_OPENING_GREETING } from '../../server/ganesha/assistant.mjs';
import { BROCHURE_CHUNKS } from '../../server/rag/brochureKnowledge.mjs';
import { sendJson } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { ok: false, message: 'Method not allowed' });
  }
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
