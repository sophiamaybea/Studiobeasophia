import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const chunkDir = path.join(root, 'asset-chunks');
const outDir = path.join(root, 'public', 'art');
await mkdir(outDir, { recursive: true });

const names = ['full.00', 'full.01', 'full.02', 'full.03'];
const chunks = await Promise.all(names.map((name) => readFile(path.join(chunkDir, name), 'utf8')));
await writeFile(path.join(outDir, 'source-full.svg'), chunks.join(''), 'utf8');
console.log('Assembled source-full.svg from original artwork chunks.');
