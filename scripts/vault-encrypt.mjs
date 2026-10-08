#!/usr/bin/env node
/**
 * Encrypts vault-src/*.md → src/vault/encrypted/<slug>.json
 *
 * Requires VAULT_PASSPHRASE env var (set in your shell, never in a file).
 * Passphrase is normalised (trim + lowercase) before key derivation —
 * matching the browser-side decryption in src/lib/vault.ts.
 *
 * Output format per file:
 *   { v: 1, kdf: "PBKDF2-SHA256", iter: 600000, salt: "<b64>", iv: "<b64>", ct: "<b64>" }
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { webcrypto } from "node:crypto";

const { subtle } = webcrypto;

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");

const raw = process.env.VAULT_PASSPHRASE;
if (!raw) {
  console.error("ERROR: VAULT_PASSPHRASE is not set.");
  console.error("  PowerShell: $env:VAULT_PASSPHRASE = 'your-phrase'");
  console.error("  bash:       export VAULT_PASSPHRASE='your-phrase'");
  process.exit(1);
}

// Same normalisation as browser-side decryptVault
const passphrase = raw.trim().toLowerCase();

const ITER = 600_000;
const enc = new TextEncoder();

async function deriveKey(salt) {
  const keyMaterial = await subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
}

function toB64(buf) {
  return Buffer.from(buf).toString("base64");
}

async function encryptFile(slug) {
  const srcPath = join(ROOT, "vault-src", `${slug}.md`);
  const outDir = join(ROOT, "src", "vault", "encrypted");
  const outPath = join(outDir, `${slug}.json`);

  const plaintext = readFileSync(srcPath);

  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(salt);

  const ctBuf = await subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);

  const result = {
    v: 1,
    kdf: "PBKDF2-SHA256",
    iter: ITER,
    salt: toB64(salt),
    iv: toB64(iv),
    ct: toB64(new Uint8Array(ctBuf)),
  };

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, JSON.stringify(result));
  console.log(`ok · encrypted ${slug} → src/vault/encrypted/${slug}.json`);
}

await encryptFile("the-real-story");
await encryptFile("series-craft");
console.log("done.");
