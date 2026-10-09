import { policy, upstream, checkBackend } from './release-common.mjs';

try {
  await checkBackend(upstream(), policy());
  console.log('BACKEND_OK: app, API contract, schema version and anonymous 401.');
} catch (error) {
  console.error(`BACKEND_FAILED: ${error.message}`);
  process.exitCode = 1;
}
