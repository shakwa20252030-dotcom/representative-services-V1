import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const root = path.resolve(import.meta.dirname, '..');

try {
  console.log('Building frontend...');
  execSync('vite build', { cwd: root, stdio: 'inherit' });

  console.log('Building server...');
  execSync('npx esbuild server/index.ts --bundle --platform=node --target=es2020 --outfile=dist/index.cjs --external:express', {
    cwd: root,
    stdio: 'inherit',
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
