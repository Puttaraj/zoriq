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

function base64UrlDecode(str: string): string {
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
