import { resolve } from 'node:path';
import { assert, command, project } from './release-common.mjs';

try {
  const kind = process.argv[2];
  assert(['patch', 'minor', 'major'].includes(kind), 'Usage: npm run release:bump -- patch|minor|major');
  assert(resolve(command('git', ['rev-parse', '--show-toplevel'], { capture: true })) === process.cwd(),
    'Run from the root of the standalone frontend repository.');
  project();
  // Do not run lifecycle hooks, commit, tag or push as a side effect of bumping.
  command('npm', ['version', kind, '--no-git-tag-version', '--ignore-scripts']);
  const { pkg } = project();
  console.log(`Version ${pkg.version}: update CHANGELOG, review and commit explicit files, then push Git.`);
} catch (error) {
  console.error(`BUMP_FAILED: ${error.message}`);
  process.exitCode = 1;
}
