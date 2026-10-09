import { existsSync, lstatSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { assert, command, hash, project } from './release-common.mjs';

try {
  const { pkg, p } = project();
  assert(pkg.scripts?.['build:app'] && !/build:release|build-release\.mjs|npm run build(?:\s|$)/.test(pkg.scripts['build:app']),
    'Keep build:app as the Vite build command; do not call the release wrapper recursively.');
  const onVercel = process.env.VERCEL === '1';
  let sha;
  if (onVercel) {
    sha = process.env.VERCEL_GIT_COMMIT_SHA || command('git', ['rev-parse', 'HEAD'], { capture: true });
    assert(sha, 'Build must identify the Git commit.');
  } else {
    assert(resolve(command('git', ['rev-parse', '--show-toplevel'], { capture: true })) === process.cwd(),
      'Build from the standalone project root.');
    assert(!command('git', ['status', '--porcelain', '--untracked-files=all'], { capture: true }),
      'Commit intended changes before a local release build.');
    sha = command('git', ['rev-parse', 'HEAD'], { capture: true });
  }
  assert(/^[0-9a-f]{40,64}$/.test(sha), 'Missing/invalid full Git SHA.');
  const builtAt = new Date().toISOString();
  const metadata = { ...p, version: pkg.version, commit: sha, built_at: builtAt,
    environment: onVercel ? process.env.VERCEL_ENV : 'local', node_version: process.version,
    release_id: `v${pkg.version}-${sha.slice(0, 12)}` };
  if (existsSync('dist')) {
    assert(!lstatSync('dist').isSymbolicLink(), 'dist must not be a symlink.');
    rmSync('dist', { recursive: true });
  }
  command('npm', ['run', 'build:app'], { env: { ...process.env,
    VITE_APP_VERSION: pkg.version, VITE_BUILD_SHA: sha, VITE_BUILD_TIME: builtAt,
    VITE_API_BASE_URL: p.api_base } });
  assert(existsSync('dist/index.html'), 'Vite must emit dist/index.html.');
  writeFileSync('dist/version.json', JSON.stringify(metadata, null, 2) + '\n');
  const files = {};
  function walk(dir, prefix = '') {
    for (const name of readdirSync(dir).sort()) {
      const relative = prefix + name;
      const path = join(dir, name);
      const stat = lstatSync(path);
      assert(!stat.isSymbolicLink() && !name.startsWith('.') && !/\.(php|sql|pem|key)$/i.test(name),
        `Unexpected private/server file in dist: ${relative}`);
      if (stat.isDirectory()) walk(path, relative + '/');
      else {
        assert(stat.isFile(), 'Only regular static files are allowed.');
        files[relative] = hash(readFileSync(path));
      }
    }
  }
  walk('dist');
  if (!onVercel) {
    assert(command('git', ['rev-parse', 'HEAD'], { capture: true }) === sha &&
      !command('git', ['status', '--porcelain', '--untracked-files=all'], { capture: true }),
      'Source changed during build (or dist is not gitignored).');
  }
  writeFileSync('dist/release-manifest.json', JSON.stringify({ ...metadata, files }, null, 2) + '\n');
  console.log(`BUILT ${metadata.release_id} (${metadata.environment})`);
} catch (error) {
  console.error(`BUILD_FAILED: ${error.message}`);
  process.exitCode = 1;
}
