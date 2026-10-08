#!/usr/bin/env node
/**
 * Fails the build if:
 *   1. Either encrypted vault JSON is missing or malformed.
 *   2. vault-src/ contains tracked files (plaintext in git).
 */

import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");

const SLUGS = ["the-real-story", "series-craft"];
let ok = true;

for (const slug of SLUGS) {
  const p = join(ROOT, "src", "vault", "encrypted", `${slug}.json`);
  if (!existsSync(p)) {
    console.error(`ERROR: missing encrypted vault file: src/vault/encrypted/${slug}.json`);
    console.error("  Run: npm run vault:encrypt  (with VAULT_PASSPHRASE set)");
    ok = false;
    continue;
  }
  try {
    const d = JSON.parse(readFileSync(p, "utf8"));
    if (d.v !== 1 || d.kdf !== "PBKDF2-SHA256" || !d.salt || !d.iv || !d.ct) {
      throw new Error("bad shape");
    }
  } catch {
    console.error(`ERROR: malformed encrypted vault file: src/vault/encrypted/${slug}.json`);
    ok = false;
  }
}

if (existsSync(join(ROOT, ".git"))) {
  try {
    const tracked = execSync("git ls-files vault-src", { cwd: ROOT, encoding: "utf8" }).trim();
    if (tracked) {
      console.error("ERROR: vault-src/ contains tracked files — plaintext in git:");
      console.error(tracked);
      ok = false;
    }
  } catch {
    // git not available — skip check
  }
}

if (!ok) process.exit(1);
console.log("ok · vault check passed");
