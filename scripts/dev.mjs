import { spawn } from 'node:child_process';

const server = spawn(process.execPath, ['server/index.mjs'], {
  stdio: 'inherit',
});

const vite = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', '--host'],
  { stdio: 'inherit' }
);

function shutdown() {
  server.kill('SIGTERM');
  vite.kill('SIGTERM');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

