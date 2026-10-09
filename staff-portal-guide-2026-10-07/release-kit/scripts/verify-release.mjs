import { assert, checkBackend, get, hash, policy } from './release-common.mjs';

try {
  const [rawUrl, expectedVersion, expectedSha] = process.argv.slice(2);
  assert(rawUrl && /^\d+\.\d+\.\d+$/.test(expectedVersion || '') && /^[0-9a-f]{40,64}$/.test(expectedSha || ''),
    'Usage: npm run release:verify -- https://<verified-app-domain> <version> <full-git-sha>');
  const url = new URL(rawUrl);
  const local = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
  assert((url.protocol === 'https:' || local) && !url.username && !url.password && !url.search && !url.hash && url.pathname === '/',
    'Pass only the verified deployment origin.');
  const p = policy();
  const suffix = `?release_probe=${Date.now()}`;
  async function json(path) {
    const response = await get(url.origin + path + suffix);
    assert(response.status === 200, `HTTP ${response.status} for ${path}. For protected previews use the authorized Vercel/browser access flow; do not disable protection.`);
    return response.json();
  }
  const version = await json('/version.json');
  assert(version.app === p.app && version.version === expectedVersion && version.commit === expectedSha,
    'Live app/version/commit does not match the intended release.');
  assert(version.api_contract === p.api_contract && version.min_schema_version === p.min_schema_version,
    'Live release policy does not match this checkout.');
  const manifest = await json('/release-manifest.json');
  for (const field of ['app', 'version', 'commit', 'release_id', 'built_at', 'environment']) {
    assert(manifest[field] === version[field], `Manifest/version mismatch: ${field}`);
  }
  const files = manifest.files;
  assert(files && typeof files === 'object' && files['index.html'] && files['version.json'], 'Incomplete file manifest.');
  assert(Object.keys(files).length <= 20000, 'Unexpected manifest size.');
  for (const [name, digest] of Object.entries(files)) {
    assert(name && name.split('/').every(part => part && part !== '.' && part !== '..') &&
      !name.includes('\\') && /^[0-9a-f]{64}$/.test(digest), 'Invalid manifest path/checksum.');
    const resource = '/' + name.split('/').map(encodeURIComponent).join('/');
    const response = await get(url.origin + resource + suffix);
    assert(response.status === 200 && hash(Buffer.from(await response.arrayBuffer())) === digest,
      `Asset content mismatch: ${name}`);
  }
  await checkBackend(url.origin + p.api_base, p);
  console.log(`VERIFIED ${version.release_id}: public files, version/commit, proxied API and anonymous 401.`);
  console.log('Authenticated browser flows still require the app test suite.');
} catch (error) {
  console.error(`VERIFY_FAILED: ${error.message}`);
  process.exitCode = 1;
}
