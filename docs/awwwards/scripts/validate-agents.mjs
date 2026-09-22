import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter } from './taste-index.mjs';

const MODELS = new Set(['opus', 'sonnet', 'haiku', 'fable', 'inherit']);

export function validateAgent(fm, filename) {
  const errors = [];
  const base = basename(filename, '.md');
  if (!fm.name) errors.push('missing name');
  else if (fm.name !== base) errors.push(`name "${fm.name}" != filename "${base}"`);
  else if (!/^[a-z][a-z0-9-]*$/.test(fm.name)) errors.push(`name must be lowercase-hyphen: ${fm.name}`);
  if (!fm.description) errors.push('missing description');
  if (fm.model && !MODELS.has(fm.model)) errors.push(`invalid model: ${fm.model}`);
  /* tools opsional: absen = agent mewarisi semua tool */
  return { valid: errors.length === 0, errors };
}

function main() {
  const dir = join(process.cwd(), '.claude/agents');
  if (!existsSync(dir)) { console.error('.claude/agents tidak ada'); process.exit(1); }
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  let bad = 0;
  for (const f of files) {
    const { valid, errors } = validateAgent(parseFrontmatter(readFileSync(join(dir, f), 'utf8')), f);
    console.log(`${valid ? 'OK' : 'FAIL'} ${f}${valid ? '' : ' -> ' + errors.join('; ')}`);
    if (!valid) bad++;
  }
  console.log(`${files.length} agent, ${bad} invalid`);
  if (bad) process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
