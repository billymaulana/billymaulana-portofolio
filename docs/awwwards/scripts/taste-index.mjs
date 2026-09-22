import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const REQUIRED = ['type', 'slug', 'title', 'source_url', 'category', 'style', 'fonts', 'grid', 'grid_type', 'mood'];

const ARRAY_FIELDS = ['category', 'style', 'fonts', 'grid_type', 'mood'];

export const GRID_TYPES = new Set([
  'swiss', 'editorial', 'asymmetric', 'edge-anchored',
  'full-bleed', 'split-panel', 'centered', 'modular', 'broken-grid', 'scattered',
]);

function unquote(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

function parseValue(raw) {
  if (raw === '' || raw === 'null' || raw === '~') return null;
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim();
    return inner ? inner.split(',').map((s) => unquote(s.trim())) : [];
  }
  if (raw !== '' && !raw.startsWith('"') && !raw.startsWith("'") && !Number.isNaN(Number(raw))) return Number(raw);
  return unquote(raw);
}

export function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^([a-zA-Z_][\w]*):\s*(.*)$/);
    if (!mm) continue;
    fm[mm[1]] = parseValue(mm[2].trim());
  }
  return fm;
}

export function validateFrontmatter(fm) {
  const errors = [];
  for (const key of REQUIRED) {
    const v = fm[key];
    if (v === undefined || v === null || v === '') errors.push(`missing required field: ${key}`);
  }
  if (fm.type && fm.type !== 'reference') errors.push(`type must be "reference", got "${fm.type}"`);
  for (const arrKey of ARRAY_FIELDS) {
    if (fm[arrKey] !== undefined && !Array.isArray(fm[arrKey])) errors.push(`${arrKey} must be an array`);
  }
  if (Array.isArray(fm.grid_type)) {
    const unknown = fm.grid_type.filter((g) => !GRID_TYPES.has(g));
    if (unknown.length) errors.push(`grid_type tidak dikenal: ${unknown.join(', ')} (pilihan: ${[...GRID_TYPES].join(', ')})`);
  }
  return { valid: errors.length === 0, errors };
}

export function toIndexEntry(fm, filename) {
  return {
    slug: fm.slug,
    title: fm.title,
    url: fm.source_url,
    category: fm.category ?? [],
    style: fm.style ?? [],
    fonts: fm.fonts ?? [],
    grid_type: fm.grid_type ?? [],
    grid: fm.grid ?? '',
    mood: fm.mood ?? [],
    libraries: fm.libraries ?? [],
    rating: fm.rating ?? null,
    summary: fm.summary ?? fm.verdict ?? '',
    path: `references/library/${filename}`,
    thumb: fm.thumb ? `references/library/${fm.thumb}` : null,
  };
}

const META_FILES = new Set(['INDEX.md', 'SCHEMA.md', 'README.md']);

export function buildIndex(libraryDir) {
  const files = readdirSync(libraryDir).filter((f) => f.endsWith('.md') && !META_FILES.has(f));
  const entries = [];
  for (const file of files) {
    const fm = parseFrontmatter(readFileSync(join(libraryDir, file), 'utf8'));
    const { valid, errors } = validateFrontmatter(fm);
    if (!valid) throw new Error(`Invalid frontmatter in ${file}: ${errors.join('; ')}`);
    entries.push(toIndexEntry(fm, file));
  }
  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  return { version: 1, updated: new Date().toISOString().slice(0, 10), count: entries.length, entries };
}

export function renderIndexMd(index) {
  const lines = [
    '# Reference Library Index',
    '',
    `> ${index.count} entri · diperbarui ${index.updated}. Dihasilkan oleh \`taste-index.mjs\` — jangan edit manual.`,
    '',
    '| Slug | Style | Mood | Rating | Ringkasan |',
    '| --- | --- | --- | --- | --- |',
  ];
  for (const e of index.entries) {
    lines.push(`| [[${e.slug}]] | ${e.style.join(', ')} | ${e.mood.join(', ')} | ${e.rating ?? '-'} | ${e.summary} |`);
  }
  return lines.join('\n') + '\n';
}

function main() {
  const libraryDir = join(process.cwd(), 'docs/awwwards/references/library');
  if (!existsSync(libraryDir)) {
    console.error(`library dir tidak ada: ${libraryDir}`);
    process.exit(1);
  }
  const index = buildIndex(libraryDir);
  writeFileSync(join(libraryDir, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  writeFileSync(join(libraryDir, 'INDEX.md'), renderIndexMd(index));
  console.log(`index dibangun: ${index.count} entri`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
