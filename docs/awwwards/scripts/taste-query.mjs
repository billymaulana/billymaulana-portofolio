import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const norm = (s) => String(s).toLowerCase();

export function queryIndex(index, filters = {}) {
  const { style, mood, category, library, font, grid, text } = filters;
  return index.entries.filter((e) => {
    if (style && !(e.style ?? []).map(norm).includes(norm(style))) return false;
    if (mood && !(e.mood ?? []).map(norm).includes(norm(mood))) return false;
    if (category && !(e.category ?? []).map(norm).includes(norm(category))) return false;
    if (library && !(e.libraries ?? []).map(norm).includes(norm(library))) return false;
    /* font dicocokkan sebagai substring: "neue" harus menemukan "PP Neue Montreal Variable" */
    if (font && !(e.fonts ?? []).some((f) => norm(f).includes(norm(font)))) return false;
    if (grid && !(e.grid_type ?? []).map(norm).includes(norm(grid))) return false;
    if (text) {
      const hay = norm([e.slug, e.title, e.summary, ...(e.style ?? []), ...(e.mood ?? []), ...(e.fonts ?? []), ...(e.grid_type ?? [])].join(' '));
      if (!hay.includes(norm(text))) return false;
    }
    return true;
  });
}

function main() {
  const filters = {};
  const free = [];
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--(\w+)=(.+)$/);
    if (m) filters[m[1]] = m[2];
    else free.push(a);
  }
  if (free.length) filters.text = free.join(' ');
  const indexPath = join(process.cwd(), 'docs/awwwards/references/library/index.json');
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const results = queryIndex(index, filters);
  console.log(`${results.length} match:`);
  for (const e of results) {
    console.log(`- ${e.slug} | style: ${(e.style ?? []).join(',')} | fonts: ${(e.fonts ?? []).join(',')} | grid: ${(e.grid_type ?? []).join(',')} | mood: ${(e.mood ?? []).join(',')} | ${e.path}${e.thumb ? ' | ' + e.thumb : ''}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
