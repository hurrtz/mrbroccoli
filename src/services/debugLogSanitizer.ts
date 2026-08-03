const REDACTED_SECRET = "[REDACTED]";
const MAX_DEBUG_VALUE_DEPTH = 6;
const MAX_DEBUG_ARRAY_LENGTH = 50;
const MAX_DEBUG_OBJECT_KEYS = 50;
const MAX_DEBUG_STRING_LENGTH = 500;

const SECRET_KEY_NAMES = new Set([
  "apikey",
  "apikeys",
  "authorization",
  "authtoken",
  "clientsecret",
  "cookie",
  "credential",
  "credentials",
  "password",
  "passphrase",
  "purchasetoken",
  "receipt",
  "refreshtoken",
  "accesstoken",
  "secret",
  "token",
  "transactionid",
  "transactiontoken",
]);

const PRIVATE_TEXT_KEY_NAMES = new Set([
  "assistantinstructions",
  "content",
  "conversationtitle",
  "detail",
  "existingsummary",
  "instructions",
  "message",
  "prompt",
  "query",
  "summary",
  "systemprompt",
  "text",
  "title",
  "transcript",
  "webcontext",
]);

// Debug payload strings are private by default. Keep this allowlist limited to
// identifiers, configuration names and lifecycle states that help reproduce a
// problem without exposing conversation content.
const SAFE_DIAGNOSTIC_TEXT_KEY_NAMES = new Set([
  "activeconversationid",
  "action",
  "actualmodel",
  "actualmodeleffort",
  "actualprovider",
  "actualroute",
  "app",
  "applanguage",
  "appstate",
  "appversion",
  "applicationid",
  "audioroute",
  "brand",
  "buildversion",
  "busy",
  "capability",
  "category",
  "code",
  "controlid",
  "dialog",
  "domain",
  "effort",
  "event",
  "executionenvironment",
  "expectedproductid",
  "failedeffort",
  "failurekind",
  "failurescope",
  "fallbackroute",
  "fallbackmodel",
  "fallbackprovider",
  "fields",
  "from",
  "host",
  "inputmode",
  "inputsource",
  "key",
  "kind",
  "language",
  "latencysampleattribution",
  "level",
  "locale",
  "method",
  "messageid",
  "model",
  "modeleffort",
  "mode",
  "manufacturer",
  "nexteffort",
  "operation",
  "orientation",
  "page",
  "phase",
  "pipelinephase",
  "platform",
  "platformversion",
  "provider",
  "providermodel",
  "productid",
  "productids",
  "purchasestate",
  "reason",
  "recorderroute",
  "reference",
  "replyplayback",
  "requestid",
  "requestedmodel",
  "requestedmodeleffort",
  "requestedprovider",
  "requestedroute",
  "route",
  "selectedprovider",
  "selectedvalue",
  "sessionid",
  "source",
  "speechlanguage",
  "stage",
  "status",
  "storagescope",
  "sttmode",
  "sttmodel",
  "sttprovider",
  "sttroute",
  "target",
  "timezone",
  "to",
  "ttsfallbackroutes",
  "ttsmode",
  "ttsmodel",
  "ttsprovider",
  "ttsroute",
  "ttsvoice",
  "turnid",
  "type",
  "visualphase",
  "voice",
  "websearchmode",
  "websearchprovider",
]);

function normalizeDebugKey(key: string) {
  return key.toLowerCase().replace(/[^a-z]/g, "");
}

function isSecretKey(key: string) {
  const normalized = normalizeDebugKey(key);
  if (SECRET_KEY_NAMES.has(normalized)) {
    return true;
  }

  return (
    normalized.endsWith("apikey") ||
    normalized.endsWith("apikeys") ||
    normalized.endsWith("accesstoken") ||
    normalized.endsWith("refreshtoken") ||
    normalized.endsWith("authtoken") ||
    normalized.endsWith("clientsecret") ||
    normalized.endsWith("purchasetoken") ||
    normalized.endsWith("receipt") ||
    normalized.endsWith("transactiontoken")
  );
}

function fingerprint(value: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function describePrivateText(value: string) {
  return `[REDACTED_TEXT length=${value.length} fingerprint=${fingerprint(value)}]`;
}

function redactSensitiveString(value: string, truncate = true) {
  const redacted = value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/\bsk-(?:ant-)?[A-Za-z0-9_-]{8,}\b/g, REDACTED_SECRET)
    .replace(/\bxai-[A-Za-z0-9_-]{8,}\b/gi, REDACTED_SECRET)
    .replace(/\bAIza[A-Za-z0-9_-]{16,}\b/g, REDACTED_SECRET)
    .replace(
      /([?&](?:api[_-]?key|access[_-]?token|authorization|client[_-]?secret|credential|password|passphrase|refresh[_-]?token|secret|token)=)[^&#\s]*/gi,
      `$1${REDACTED_SECRET}`,
    )
    .replace(
      /((?:api[_ -]?key|access[_ -]?token|authorization|client[_ -]?secret|credential|password|passphrase|refresh[_ -]?token|secret|token)\s*[:=]\s*["']?)[^"',}\s]+/gi,
      `$1${REDACTED_SECRET}`,
    );

  if (!truncate || redacted.length <= MAX_DEBUG_STRING_LENGTH) {
    return redacted;
  }
  return `${redacted.slice(0, MAX_DEBUG_STRING_LENGTH)}[TRUNCATED ${redacted.length - MAX_DEBUG_STRING_LENGTH} chars]`;
}

function sanitizeStack(stack: string | undefined) {
  if (!stack) {
    return undefined;
  }

  const frames = stack
    .split("\n")
    .slice(1)
    .filter((line) =>
      /(?:\/(?:src|app)\/|MrBroccoli|\.(?:kt|swift):\d+)/.test(line),
    )
    .slice(0, 8)
    .map((line) =>
      line
        .trim()
        .replace(/(?:file:\/\/)?[^\s()]*(?=\/(?:src|app)\/)/g, "")
        .slice(0, MAX_DEBUG_STRING_LENGTH),
    );

  return frames.length > 0 ? frames : undefined;
}

function sanitizeError(error: Error) {
  const extended = error as Error & {
    code?: unknown;
    failureKind?: unknown;
    status?: unknown;
  };
  const stack = sanitizeStack(error.stack);
  return {
    name: error.name || "Error",
    messageFingerprint: fingerprint(error.message || error.name || "Error"),
    ...(typeof extended.code === "string"
      ? { code: redactSensitiveString(extended.code) }
      : {}),
    ...(typeof extended.failureKind === "string"
      ? { failureKind: redactSensitiveString(extended.failureKind) }
      : {}),
    ...(typeof extended.status === "number" ? { status: extended.status } : {}),
    ...(stack ? { stack } : {}),
  };
}

export function sanitizeDebugValue(
  value: unknown,
  key = "",
  depth = 0,
  seen = new WeakSet<object>(),
): unknown {
  const normalizedKey = normalizeDebugKey(key);

  if (isSecretKey(key)) {
    return REDACTED_SECRET;
  }
  if (PRIVATE_TEXT_KEY_NAMES.has(normalizedKey) && typeof value === "string") {
    return describePrivateText(value);
  }
  if (typeof value === "string") {
    return SAFE_DIAGNOSTIC_TEXT_KEY_NAMES.has(normalizedKey)
      ? redactSensitiveString(value)
      : describePrivateText(value);
  }
  if (
    value === null ||
    value === undefined ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (value instanceof Error) {
    return sanitizeError(value);
  }
  if (depth >= MAX_DEBUG_VALUE_DEPTH) {
    return "[TRUNCATED]";
  }
  if (typeof value !== "object") {
    return String(value);
  }
  if (seen.has(value)) {
    return "[CIRCULAR]";
  }
  seen.add(value);

  if (Array.isArray(value)) {
    const sanitized = value
      .slice(0, MAX_DEBUG_ARRAY_LENGTH)
      .map((entry) => sanitizeDebugValue(entry, key, depth + 1, seen));
    if (value.length > MAX_DEBUG_ARRAY_LENGTH) {
      sanitized.push(
        `[TRUNCATED ${value.length - MAX_DEBUG_ARRAY_LENGTH} items]`,
      );
    }
    return sanitized;
  }

  const entries = Object.entries(value);
  const sanitized = Object.fromEntries(
    entries
      .slice(0, MAX_DEBUG_OBJECT_KEYS)
      .map(([entryKey, entryValue]) => [
        entryKey,
        sanitizeDebugValue(entryValue, entryKey, depth + 1, seen),
      ]),
  );
  if (entries.length > MAX_DEBUG_OBJECT_KEYS) {
    sanitized._truncatedKeys = entries.length - MAX_DEBUG_OBJECT_KEYS;
  }
  return sanitized;
}

export function sanitizeDebugPayload(payload?: Record<string, unknown>) {
  return payload
    ? (sanitizeDebugValue(payload) as Record<string, unknown>)
    : undefined;
}

export function sanitizeConsoleArguments(args: unknown[]) {
  const sanitizeConsoleValue = (
    value: unknown,
    depth = 0,
    seen = new WeakSet<object>(),
  ): unknown => {
    if (typeof value === "string") return describePrivateText(value);
    if (
      value === null ||
      value === undefined ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }
    if (value instanceof Error) return sanitizeError(value);
    if (depth >= MAX_DEBUG_VALUE_DEPTH) return "[TRUNCATED]";
    if (typeof value !== "object") return describePrivateText(String(value));
    if (seen.has(value)) return "[CIRCULAR]";
    seen.add(value);
    if (Array.isArray(value)) {
      const sanitized = value
        .slice(0, MAX_DEBUG_ARRAY_LENGTH)
        .map((entry) => sanitizeConsoleValue(entry, depth + 1, seen));
      if (value.length > MAX_DEBUG_ARRAY_LENGTH) {
        sanitized.push(
          `[TRUNCATED ${value.length - MAX_DEBUG_ARRAY_LENGTH} items]`,
        );
      }
      return sanitized;
    }
    const entries = Object.entries(value);
    const sanitized = Object.fromEntries(
      entries
        .slice(0, MAX_DEBUG_OBJECT_KEYS)
        .map(([entryKey, entryValue]) => [
          entryKey,
          isSecretKey(entryKey)
            ? REDACTED_SECRET
            : sanitizeConsoleValue(entryValue, depth + 1, seen),
        ]),
    );
    if (entries.length > MAX_DEBUG_OBJECT_KEYS) {
      sanitized._truncatedKeys = entries.length - MAX_DEBUG_OBJECT_KEYS;
    }
    return sanitized;
  };

  return args.map((argument) => sanitizeConsoleValue(argument));
}

export function sanitizeRecoveredLegacyLog(content: string) {
  return redactSensitiveString(content, false)
    .replace(
      /("(?:[^"\\]|\\.)*(?:apiKey|apiKeys|accessToken|refreshToken|authToken|clientSecret|authorization|password|passphrase|secret|token)(?:[^"\\]|\\.)*"\s*:\s*)"(?:[^"\\]|\\.)*"/gi,
      `$1"${REDACTED_SECRET}"`,
    )
    .replace(
      /("(?:content|conversationTitle|detail|instructions|message|prompt|query|summary|systemPrompt|text|title|transcript|webContext)"\s*:\s*)"((?:[^"\\]|\\.)*)"/gi,
      (_match, prefix: string, text: string) =>
        `${prefix}"${describePrivateText(text)}"`,
    );
}

export const DEBUG_LOG_LIMITS = {
  arrayLength: MAX_DEBUG_ARRAY_LENGTH,
  objectKeys: MAX_DEBUG_OBJECT_KEYS,
  stringLength: MAX_DEBUG_STRING_LENGTH,
} as const;
