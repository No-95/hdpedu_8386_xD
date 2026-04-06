/**
 * Regenerates JWT_PRIVATE_KEY + JWKS for @convex-dev/auth and pushes them
 * to the Convex prod deployment.
 *
 * Key format facts:
 *  - @convex-dev/auth stores JWT_PRIVATE_KEY with newlines replaced by spaces.
 *    This is intentional: jose's importPKCS8 handles space-separated lines.
 *  - JWKS is a single-line JSON string (no newlines), so both values can be
 *    passed to `npx convex env set` without any multi-line quoting issues.
 *
 * Run with: node scripts/regen-auth-keys.mjs
 */
import { generateKeyPairSync, createPublicKey } from 'node:crypto';
import { spawnSync } from 'node:child_process';

// ── 1. Generate fresh RSA-2048 key pair ──────────────────────────────────────
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding:  { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Format exactly as @convex-dev/auth stores it: replace all \n with spaces
const storedPrivKey = privateKey.trimEnd().replace(/\n/g, ' ');

// Build valid JSON JWKS (no newlines — safe for CLI args)
const jwk  = createPublicKey(publicKey).export({ format: 'jwk' });
const jwks = JSON.stringify({ keys: [{ use: 'sig', kty: jwk.kty, n: jwk.n, e: jwk.e }] });

console.log('JWT_PRIVATE_KEY length:', storedPrivKey.length, '(has newlines:', storedPrivKey.includes('\n'), ')');
console.log('JWKS length:           ', jwks.length);
console.log('JWKS preview:          ', jwks.slice(0, 80) + '...\n');

// ── 2. Push via CLI through cmd.exe (no newlines = no quoting issues) ────────
// ── 2. Push via CLI — pipe value through stdin (avoids "--" prefix issue) ────
// `npx convex env set NAME` reads from stdin when no value arg is given.
import { spawn } from 'node:child_process';

function setConvexEnvViaPipe(name, value) {
  return new Promise((resolve, reject) => {
    console.log(`Setting ${name} via stdin pipe...`);
    const proc = spawn(
      'cmd.exe',
      ['/C', 'npx', 'convex', 'env', '--prod', 'set', name],
      {
        cwd: process.cwd(),
        stdio: ['pipe', 'inherit', 'inherit'],
        shell: false,
      }
    );
    proc.stdin.write(value);
    proc.stdin.end();
    proc.on('close', (code) => {
      if (code !== 0) reject(new Error(`Failed to set ${name} (exit code ${code})`));
      else { console.log(`✓ ${name} done\n`); resolve(); }
    });
    proc.on('error', reject);
  });
}

await setConvexEnvViaPipe('JWT_PRIVATE_KEY', storedPrivKey);
await setConvexEnvViaPipe('JWKS', jwks);

console.log('Both keys updated in Convex prod.');
console.log('The new JWKS is valid JSON with properly quoted keys.');
console.log('Changes take effect immediately — no redeploy needed.');
