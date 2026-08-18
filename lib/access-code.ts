import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Hashes a folder access code for storage. Uses scrypt (built into
 * Node, no extra dependency) with a random per-code salt. Never store
 * or log the plaintext code — only the salt + hash pair this returns.
 */
export function hashAccessCode(code: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(code, salt, 64).toString("hex");
  return { hash, salt };
}

/** Constant-time comparison so a wrong guess can't be timed to leak info. */
export function verifyAccessCode(code: string, hash: string, salt: string): boolean {
  try {
    const candidate = scryptSync(code, salt, 64);
    const expected = Buffer.from(hash, "hex");
    if (candidate.length !== expected.length) return false;
    return timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}
