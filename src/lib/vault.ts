export async function hashPassphrase(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const STORED_HASH =
  "51f048a4ab1a15ffdad4da563d2ef6a1d504a298ee3b4def3aed49cef81d49b7";

export async function verifyPassphrase(input: string): Promise<boolean> {
  const hash = await hashPassphrase(input.trim().toLowerCase());
  return hash === STORED_HASH;
}

export function isVaultUnlocked(): boolean {
  try {
    return localStorage.getItem("ncs_vault_unlocked") === "true";
  } catch {
    return false;
  }
}

export function unlockVault(): void {
  try {
    localStorage.setItem("ncs_vault_unlocked", "true");
  } catch {}
}

export function lockVault(): void {
  try {
    localStorage.removeItem("ncs_vault_unlocked");
  } catch {}
}
