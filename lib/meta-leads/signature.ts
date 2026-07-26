import crypto from "node:crypto";

/** Constant-time string compare that never throws on length mismatch. */
export const safeEqual = (a: string, b: string) => {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Meta signs every event notification with `X-Hub-Signature-256: sha256=<hmac>`,
 * where the HMAC is taken over the *raw* request body keyed with the app secret.
 * Anything that fails this check is not from Meta and must be discarded.
 */
export const verifyMetaSignature = (rawBody: string, header: string | null) => {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return { ok: false, reason: "META_APP_SECRET is not configured" };
  if (!header) return { ok: false, reason: "Missing X-Hub-Signature-256 header" };

  const [algorithm, signature] = header.split("=");
  if (algorithm !== "sha256" || !signature) {
    return { ok: false, reason: "Malformed X-Hub-Signature-256 header" };
  }

  const expected = crypto.createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");
  if (!safeEqual(signature, expected)) return { ok: false, reason: "Signature mismatch" };

  return { ok: true, reason: "" };
};
