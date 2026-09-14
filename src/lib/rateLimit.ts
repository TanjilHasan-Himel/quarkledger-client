// Rate Limiting & Abuse Prevention Utility
// In-memory sliding window rate limiter with auto-eviction

interface RateLimitConfig {
  intervalMs: number; // Time window in milliseconds
  maxRequests: number; // Max allowed requests within the window
}

interface ClientTracker {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, ClientTracker>();

// Periodic cleanup every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of memoryStore.entries()) {
      if (now > value.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks whether a given identifier (IP or user ID) has exceeded the request threshold.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { intervalMs: 60_000, maxRequests: 30 }
): { allowed: boolean; remaining: number; resetTimeMs: number } {
  const now = Date.now();
  const client = memoryStore.get(identifier);

  if (!client || now > client.resetAt) {
    // New or expired window
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + config.intervalMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTimeMs: config.intervalMs,
    };
  }

  if (client.count >= config.maxRequests) {
    // Limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTimeMs: Math.max(0, client.resetAt - now),
    };
  }

  // Increment counter
  client.count += 1;
  return {
    allowed: true,
    remaining: config.maxRequests - client.count,
    resetTimeMs: Math.max(0, client.resetAt - now),
  };
}

/**
 * Extracts client IP safely from request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Sanitizes search input to prevent PostgREST / SQL filter injection
 * Strips PostgREST reserved delimiter characters: commas, parentheses, quotes, percent
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  return query
    .replace(/[(),."':;\\%$#@!^&*<>{}[\]?/~`+=|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);
}
