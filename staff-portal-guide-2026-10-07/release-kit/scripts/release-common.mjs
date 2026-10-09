import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

export function assert(value, message) {
  if (!value) throw new Error(message);
}

export function command(program, args, { capture = false, env = process.env } = {}) {
  const result = spawnSync(program, args, { encoding: 'utf8', env, stdio: capture ? 'pipe' : 'inherit' });
  if (result.error) throw result.error;
  assert(result.status === 0, `${program} ${args.join(' ')} failed (exit ${result.status}).`);
  return capture ? result.stdout.trim() : '';
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function policy() {
  const p = readJson('release.policy.json');
  assert(p.app === 'wings-staff-portal' && p.base_path === '/' && p.api_base === '/api/1/staff-portal',
    'Review the release kit before changing app name or URL paths.');
  assert(typeof p.api_contract === 'string' && p.api_contract.length > 0, 'Missing API contract.');
  assert(Number.isInteger(p.min_schema_version) && p.min_schema_version >= 1, 'Invalid schema version.');
  return p;
}

export function project() {
  const p = policy();
  const pkg = readJson('package.json');
  const lock = readJson('package-lock.json');
  assert(pkg.name === p.app, 'Run in the wings-staff-portal project.');
  assert(/^\d+\.\d+\.\d+$/.test(pkg.version), 'Use a stable x.y.z release version.');
  assert(pkg.version === lock.version && pkg.version === lock.packages?.['']?.version,
    'package.json and package-lock.json versions must match (npm lockfile v2/v3).');
  return { pkg, p };
}

export const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

export function upstream() {
  const raw = process.env.WINGS_API_UPSTREAM;
  assert(raw, 'Set WINGS_API_UPSTREAM for this environment; there is no production fallback.');
  const url = new URL(raw);
  const local = !process.env.VERCEL && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
  assert((url.protocol === 'https:' || local) && !url.username && !url.password && !url.search && !url.hash,
    'Use an HTTPS API base without credentials, query or fragment. HTTP loopback is local-only.');
  assert(url.pathname !== '/', 'API base must include the module path.');
  const base = url.href.replace(/\/+$/, '');
  const prod = 'https://api.wingslashes.com/1/staff-portal';
  if (process.env.VERCEL_ENV === 'production') assert(base === prod, 'Production must use the approved Wings API domain/path.');
  else assert(base !== prod, 'Preview/development must use an isolated staging/local backend.');
  return base;
}

export async function get(url) {
  // No credentials or redirects: a login/challenge page is not an API success.
  return fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000),
    headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' } });
}

export async function checkBackend(base, p) {
  const suffix = `?release_probe=${Date.now()}`;
  const health = await get(`${base}/health${suffix}`);
  assert(health.status === 200, `API health HTTP ${health.status}; check routing/backend/Cloudflare.`);
  const body = await health.json();
  assert(body.status === 'success' && body.code === '0000' && body.data?.app === p.app, 'Wrong app or health response.');
  assert(body.data.api_contract === p.api_contract, 'Backend API contract is incompatible.');
  assert(Number.isInteger(body.data.schema_version) && body.data.schema_version >= p.min_schema_version,
    'Apply and verify the required backend migration before releasing frontend.');
  const anonymous = await get(`${base}/auth/me${suffix}`);
  assert(anonymous.status === 401, `Anonymous auth/me must return 401; received ${anonymous.status}.`);
  assert((await anonymous.json()).status === 'error', 'Anonymous auth/me must return a JSON error.');
}
