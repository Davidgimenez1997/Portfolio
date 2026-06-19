import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const localEnvPath = resolve('.env.local');

if (existsSync(localEnvPath)) {
  const lines = readFileSync(localEnvPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const separatorIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    process.env[key] ??= value;
  }
}

const config = {
  gtmContainerId: process.env.GTM_CONTAINER_ID ?? '',
  gaMeasurementId: process.env.GA_MEASUREMENT_ID ?? '',
};

const outputDir = resolve('public/config');
const outputPath = resolve(outputDir, 'analytics.json');

await mkdir(outputDir, { recursive: true });
await writeFile(`${outputPath}`, `${JSON.stringify(config, null, 2)}\n`);
