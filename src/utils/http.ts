export interface ParsedApiResult<T> {
  data: T | null;
  isJson: boolean;
}

/**
 * Reads an HTTP response as text first and parses JSON safely so non-JSON
 * server responses (e.g., 404/502 HTML or plain text) never throw raw SyntaxErrors.
 */
export async function readJsonSafely<T = Record<string, unknown>>(
  response: Response
): Promise<ParsedApiResult<T>> {
  const raw = await response.text();
  if (!raw.trim()) {
    return { data: null, isJson: true };
  }
  try {
    return { data: JSON.parse(raw) as T, isJson: true };
  } catch {
    return { data: null, isJson: false };
  }
}
