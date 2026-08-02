const VECTOR_DIMENSIONS = 128;
const MAX_EMBEDDING_TOKENS = 320;

function hashFeature(value: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

export function tokenizeKnowledgeText(text: string) {
  return (
    text
      .normalize("NFKC")
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu) ?? []
  ).slice(0, MAX_EMBEDDING_TOKENS);
}

function addFeature(vector: Float32Array, feature: string, weight: number) {
  const hash = hashFeature(feature);
  const index = hash % VECTOR_DIMENSIONS;
  const sign = hash & 0x80000000 ? -1 : 1;
  vector[index] += sign * weight;
}

/**
 * Produces a tiny, deterministic lexical embedding. It is deliberately kept
 * separate from the index so a multilingual neural adapter can replace it
 * without changing the persisted knowledge schema or retrieval API.
 */
export function createLocalKnowledgeEmbedding(text: string) {
  const vector = new Float32Array(VECTOR_DIMENSIONS);
  const tokens = tokenizeKnowledgeText(text);

  for (const token of tokens) {
    addFeature(vector, `w:${token}`, 1);

    if (token.length >= 3) {
      const padded = `^${token}$`;
      for (let index = 0; index <= padded.length - 3; index += 1) {
        addFeature(vector, `c:${padded.slice(index, index + 3)}`, 0.35);
      }
    }
  }

  let normSquared = 0;
  for (const value of vector) {
    normSquared += value * value;
  }
  const norm = Math.sqrt(normSquared);
  const quantized = new Uint8Array(VECTOR_DIMENSIONS);

  if (norm === 0) {
    return quantized;
  }

  for (let index = 0; index < vector.length; index += 1) {
    const signedValue = Math.max(
      -127,
      Math.min(127, Math.round((vector[index] / norm) * 127)),
    );
    quantized[index] = signedValue < 0 ? signedValue + 256 : signedValue;
  }

  return quantized;
}

function getSignedValue(vector: Uint8Array, index: number) {
  const value = vector[index] ?? 0;
  return value > 127 ? value - 256 : value;
}

export function compareLocalKnowledgeEmbeddings(
  left: Uint8Array,
  right: Uint8Array,
) {
  const dimensions = Math.min(left.length, right.length);
  let dotProduct = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (let index = 0; index < dimensions; index += 1) {
    const leftValue = getSignedValue(left, index);
    const rightValue = getSignedValue(right, index);
    dotProduct += leftValue * rightValue;
    leftNorm += leftValue * leftValue;
    rightNorm += rightValue * rightValue;
  }

  if (leftNorm === 0 || rightNorm === 0) {
    return 0;
  }

  return dotProduct / Math.sqrt(leftNorm * rightNorm);
}

export const LOCAL_KNOWLEDGE_EMBEDDING = {
  dimensions: VECTOR_DIMENSIONS,
  id: "local-lexical-hash-v1",
  semantic: false,
} as const;
