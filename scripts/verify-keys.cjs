/**
 * Verifies that JWT_PRIVATE_KEY and JWKS in Convex prod are a matched pair.
 * Run with: node scripts/verify-keys.cjs
 */
const jose = require('../node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/node/cjs/index.js');
const { spawnSync } = require('child_process');

async function main() {
  // Get JWT_PRIVATE_KEY from prod
  const r = spawnSync('cmd.exe', ['/C', 'npx', 'convex', 'env', '--prod', 'get', 'JWT_PRIVATE_KEY'], {
    cwd: process.cwd(), encoding: 'utf8', shell: false,
  });
  const storedKey = r.stdout.trim();
  console.log('JWT_PRIVATE_KEY length:', storedKey.length, '| has-newlines:', storedKey.includes('\n'));

  // Import private key (jose handles spaces-as-newlines)
  const privateKey = await jose.importPKCS8(storedKey, 'RS256');
  console.log('Private key imported: OK');

  // Sign a test JWT
  const token = await new jose.SignJWT({ sub: 'verify-test' })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setExpirationTime('1m')
    .sign(privateKey);
  console.log('JWT signed: OK, length', token.length);

  // Fetch JWKS from endpoint
  const resp = await fetch('https://adept-tapir-159.convex.site/.well-known/jwks.json');
  const jwksJson = await resp.json();
  console.log('JWKS fetched: OK, keys count:', jwksJson.keys.length, '| use:', jwksJson.keys[0].use, '| kty:', jwksJson.keys[0].kty);

  // Verify JWT with JWKS public key
  const pubKey = await jose.importJWK(jwksJson.keys[0], 'RS256');
  const { payload } = await jose.jwtVerify(token, pubKey, { algorithms: ['RS256'] });
  console.log('JWT VERIFIED: sub =', payload.sub);
  console.log('\n✅ Keys are matched and working!');
}

main().catch(e => {
  console.error('\n❌ VERIFICATION FAILED:', e.message);
  process.exit(1);
});
