/**
 * Client-Side JWT Parser and Validator
 * Zero external dependencies, zero network requests.
 */

export interface DecodedJwt {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  rawHeader: string;
  rawPayload: string;
  isExpired: boolean;
  expiresAt: Date | null;
  issuedAt: Date | null;
  secondsRemaining: number | null;
}

export function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return atob(base64);
  }
}

export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function parseJwt(token: string): DecodedJwt | null {
  const clean = token.trim();
  const parts = clean.split(".");

  if (parts.length !== 3) {
    return null;
  }

  try {
    const rawHeader = base64UrlDecode(parts[0]);
    const rawPayload = base64UrlDecode(parts[1]);
    const signature = parts[2];

    const header = JSON.parse(rawHeader);
    const payload = JSON.parse(rawPayload);

    let expiresAt: Date | null = null;
    let issuedAt: Date | null = null;
    let isExpired = false;
    let secondsRemaining: number | null = null;

    if (payload && typeof payload.exp === "number") {
      expiresAt = new Date(payload.exp * 1000);
      const diffSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
      isExpired = diffSeconds <= 0;
      secondsRemaining = diffSeconds;
    }

    if (payload && typeof payload.iat === "number") {
      issuedAt = new Date(payload.iat * 1000);
    }

    return {
      header,
      payload,
      signature,
      rawHeader,
      rawPayload,
      isExpired,
      expiresAt,
      issuedAt,
      secondsRemaining,
    };
  } catch {
    return null;
  }
}

/**
 * Format dynamic countdown string from seconds remaining.
 */
export function formatDetailedCountdown(seconds: number | null): {
  text: string;
  isExpired: boolean;
  severity: "expired" | "urgent" | "valid" | "none";
} {
  if (seconds === null) {
    return {
      text: "No expiration set (token never expires)",
      isExpired: false,
      severity: "none",
    };
  }

  if (seconds <= 0) {
    const elapsed = Math.abs(seconds);
    const days = Math.floor(elapsed / (3600 * 24));
    const hours = Math.floor((elapsed % (3600 * 24)) / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    const secs = elapsed % 60;

    let timeAgo = "";
    if (days > 0) timeAgo = `${days}d ${hours}h ago`;
    else if (hours > 0) timeAgo = `${hours}h ${mins}m ago`;
    else if (mins > 0) timeAgo = `${mins}m ${secs}s ago`;
    else timeAgo = `${secs}s ago`;

    return {
      text: `Expired ${timeAgo}`,
      isExpired: true,
      severity: "expired",
    };
  }

  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let remaining = "";
  if (days > 0) remaining = `${days}d ${hours}h ${mins}m ${secs}s`;
  else if (hours > 0) remaining = `${hours}h ${mins}m ${secs}s`;
  else remaining = `${mins}m ${secs}s`;

  return {
    text: `Expires in ${remaining}`,
    isExpired: false,
    severity: seconds < 300 ? "urgent" : "valid",
  };
}

/**
 * Verify HMAC-SHA256 signature completely client-side via Web Crypto API.
 */
export async function verifyHmacSha256(
  token: string,
  secret: string,
): Promise<boolean> {
  const parts = token.trim().split(".");
  if (parts.length !== 3 || !secret) {
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const dataToSign = encoder.encode(`${parts[0]}.${parts[1]}`);

    const key = await window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"],
    );

    const signatureBuffer = await window.crypto.subtle.sign(
      "HMAC",
      key,
      dataToSign,
    );
    const computedSignatureB64Url = base64UrlEncode(
      new Uint8Array(signatureBuffer),
    );

    return computedSignatureB64Url === parts[2];
  } catch (err) {
    console.error("HMAC verification error", err);
    return false;
  }
}
