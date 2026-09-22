import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter, validateFrontmatter } from './taste-index.mjs';

function arr(a) { return `[${(a ?? []).join(', ')}]`; }
function str(s) { return s == null ? 'null' : `"${String(s).replace(/"/g, '\\"')}"`; }
function cell(s) { return s == null ? '-' : String(s).replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim() || '-'; }

export function buildNote(p) {
  const lines = [
    '---',
    'type: reference',
    `slug: ${p.slug}`,
    `title: ${str(p.title)}`,
    `source_url: ${p.source_url}`,
    `captured: ${p.captured ?? new Date().toISOString().slice(0, 10)}`,
    p.awwwards_status ? `awwwards_status: ${p.awwwards_status}` : null,
    `category: ${arr(p.category)}`,
    `style: ${arr(p.style)}`,
    `fonts: ${arr(p.fonts)}`,
    `grid: ${p.grid ?? ''}`,
    `grid_type: ${arr(p.grid_type)}`,
    `motion: ${arr(p.motion)}`,
    `libraries: ${arr(p.libraries)}`,
    `mood: ${arr(p.mood)}`,
    p.verdict ? `verdict: ${str(p.verdict)}` : null,
    p.influence ? `influence: ${p.influence}` : null,
    p.rating != null ? `rating: ${p.rating}` : null,
    `thumb: ${p.thumb ?? 'null'}`,
    p.summary ? `summary: ${str(p.summary)}` : null,
  ];
  if (p.typography) {
    lines.push('typography:', `  primary: ${str(p.typography.primary)}`);
    for (const key of ['masthead', 'secondary', 'label', 'accent']) {
      if (p.typography[key]) lines.push(`  ${key}: ${str(p.typography[key])}`);
    }
    if (p.typography.traits) lines.push(`  traits: ${arr(p.typography.traits)}`);
  }
  if (p.color) {
    lines.push('color:', `  bg: ${str(p.color.bg)}`, `  mode: ${p.color.mode ?? 'dark'}`);
    if (p.color.accent) lines.push(`  accent: ${arr(p.color.accent.map((c) => `"${c}"`))}`);
  }
  lines.push('---', '');
  const a = p.analysis ?? {};
  lines.push(
    '## Apa yang Menarik', a.menarik ?? '', '',
    '## Teknik yang Diidentifikasi', a.teknik ?? '', '',
    '## Timing & Feel', a.timing ?? '', '',
    '## Kenapa Terasa Premium', a.premium ?? '', '',
  );
  const sec = renderSections(p.sections);
  if (sec) lines.push(sec, '');
  return lines.filter((l) => l !== null).join('\n');
}

export function renderSections(sections) {
  if (!Array.isArray(sections) || !sections.length) return '';
  const lines = ['## Section-by-Section', ''];
  sections.forEach((s, i) => {
    lines.push(
      s.screenshot ? `### ${i + 1}. ${s.name} (\`${s.screenshot}\`)` : `### ${i + 1}. ${s.name}`,
      '',
      '| Aspek | Detail |',
      '| --- | --- |',
      `| Layout | ${cell(s.layout)} |`,
      `| Typography | ${cell(s.typography)} |`,
      `| Motion | ${cell(s.motion)} |`,
      `| Color | ${cell(s.color)} |`,
      `| Konsep | ${cell(s.concept)} |`,
      `| Teknik | ${cell(s.technique)} |`,
      '',
    );
  });
  return lines.join('\n');
}

export function appendSections(notePath, sections) {
  const block = renderSections(sections);
  if (!block) return { appended: false };
  let content = readFileSync(notePath, 'utf8');
  const idx = content.indexOf('\n## Section-by-Section');
  if (idx !== -1) content = content.slice(0, idx);
  content = `${content.replace(/\s+$/, '')}\n\n${block}\n`;
  writeFileSync(notePath, content);
  return { appended: true };
}

export function writeNote(libraryDir, p) {
  const content = buildNote(p);
  const { valid, errors } = validateFrontmatter(parseFrontmatter(content));
  if (!valid) throw new Error(`payload invalid: ${errors.join('; ')}`);
  const path = join(libraryDir, `${p.slug}.md`);
  writeFileSync(path, content);
  return path;
}

function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--append') {
    const [, notePath, payloadPath] = args;
    if (!notePath || !existsSync(notePath) || !payloadPath || !existsSync(payloadPath)) {
      console.error('usage: capture-scaffold.mjs --append <note.md> <payload.json>');
      process.exit(1);
    }
    const { sections } = JSON.parse(readFileSync(payloadPath, 'utf8'));
    const res = appendSections(notePath, sections);
    console.log(`sections appended: ${res.appended} -> ${notePath}`);
    return;
  }
  const payloadPath = args[0];
  if (!payloadPath || !existsSync(payloadPath)) {
    console.error('usage: capture-scaffold.mjs <payload.json>  |  --append <note.md> <payload.json>');
    process.exit(1);
  }
  const libraryDir = join(process.cwd(), 'docs/awwwards/references/library');
  const path = writeNote(libraryDir, JSON.parse(readFileSync(payloadPath, 'utf8')));
  console.log(`note ditulis: ${path}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
