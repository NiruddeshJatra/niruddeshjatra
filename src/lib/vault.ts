interface CipherData {
  v: 1;
  kdf: "PBKDF2-SHA256";
  iter: number;
  salt: string;
  iv: string;
  ct: string;
}

// In-memory only — cleared on page reload, never persisted
const vaultStore = new Map<string, string>();

function b64ToBytes(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function deriveKey(passphrase: string, salt: Uint8Array, iter: number): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
}

async function loadCipher(slug: "the-real-story" | "series-craft"): Promise<CipherData> {
  if (slug === "the-real-story") {
    const m = await import("../vault/encrypted/the-real-story.json");
    return m.default as CipherData;
  }
  const m = await import("../vault/encrypted/series-craft.json");
  return m.default as CipherData;
}

// Normalise passphrase the same way the encrypt script does
function normalise(p: string): string {
  return p.trim().toLowerCase();
}

export async function decryptVault(
  slug: "the-real-story" | "series-craft",
  passphrase: string,
): Promise<string | null> {
  try {
    const cipher = await loadCipher(slug);
    const salt = b64ToBytes(cipher.salt);
    const iv = b64ToBytes(cipher.iv);
    const ct = b64ToBytes(cipher.ct);
    const key = await deriveKey(normalise(passphrase), salt, cipher.iter);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    return new TextDecoder().decode(plain);
  } catch {
    return null;
  }
}

// Decrypt both pages and store in memory. Returns true on success.
export async function unlockVaultPages(passphrase: string): Promise<boolean> {
  const [story, craft] = await Promise.all([
    decryptVault("the-real-story", passphrase),
    decryptVault("series-craft", passphrase),
  ]);
  if (story === null || craft === null) return false;
  vaultStore.set("the-real-story", story);
  vaultStore.set("series-craft", craft);
  return true;
}

export function getVaultText(slug: string): string | null {
  return vaultStore.get(slug) ?? null;
}
