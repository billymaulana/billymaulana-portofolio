import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseFrontmatter, validateFrontmatter, toIndexEntry, buildIndex } from './taste-index.mjs';

test('parseFrontmatter: scalar, inline array, null, angka; abaikan nested', () => {
  const md = [
    '---',
    'type: reference',
    'slug: x',
    'title: "X Site"',
    'category: [portfolio, agency]',
    'rating: 8.5',
    'thumb: null',
    'color:',
    '  bg: "#000"',
    '---',
    'body',
  ].join('\n');
  const fm = parseFrontmatter(md);
  assert.equal(fm.type, 'reference');
  assert.equal(fm.title, 'X Site');
  assert.deepEqual(fm.category, ['portfolio', 'agency']);
  assert.equal(fm.rating, 8.5);
  assert.equal(fm.thumb, null);
  assert.equal(fm.bg, undefined);
});

test('validateFrontmatter menandai field wajib hilang', () => {
  const { valid, errors } = validateFrontmatter({ type: 'reference', slug: 'x' });
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes('title')));
});

test('validateFrontmatter lolos untuk lengkap', () => {
  const fm = { type: 'reference', slug: 'x', title: 'X', source_url: 'https://x.com', category: ['portfolio'], style: ['minimalism'], fonts: ['Suisse'], grid: 'Swiss 12-col, gutter 24px', grid_type: ['swiss'], mood: ['calm'] };
  assert.deepEqual(validateFrontmatter(fm), { valid: true, errors: [] });
});

test('validateFrontmatter mewajibkan fonts dan grid_type', () => {
  const base = { type: 'reference', slug: 'x', title: 'X', source_url: 'https://x.com', category: ['portfolio'], style: ['minimalism'], mood: ['calm'] };
  const { valid, errors } = validateFrontmatter(base);
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes('fonts')));
  assert.ok(errors.some((e) => e.includes('grid_type')));
});

test('validateFrontmatter menolak grid_type di luar kosakata', () => {
  const fm = { type: 'reference', slug: 'x', title: 'X', source_url: 'https://x.com', category: ['portfolio'], style: ['minimalism'], fonts: ['Suisse'], grid_type: ['swiss', 'bootstrap'], mood: ['calm'] };
  const { valid, errors } = validateFrontmatter(fm);
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes('bootstrap')));
});

test('toIndexEntry memetakan field & menurunkan path/thumb', () => {
  const fm = { slug: 'x', title: 'X', source_url: 'https://x.com', category: ['portfolio'], style: ['minimalism'], fonts: ['Suisse', 'Apparel'], grid_type: ['swiss'], grid: 'Swiss 12-col', mood: ['calm'], thumb: 'assets/x-desktop.png' };
  const e = toIndexEntry(fm, 'x.md');
  assert.equal(e.path, 'references/library/x.md');
  assert.equal(e.thumb, 'references/library/assets/x-desktop.png');
  assert.equal(e.url, 'https://x.com');
  assert.deepEqual(e.fonts, ['Suisse', 'Apparel']);
  assert.deepEqual(e.grid_type, ['swiss']);
  assert.equal(e.grid, 'Swiss 12-col');
});

test('buildIndex memindai dir, kecualikan INDEX.md, urut by slug', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lib-'));
  const note = (slug) => `---\ntype: reference\nslug: ${slug}\ntitle: ${slug}\nsource_url: https://${slug}.com\ncategory: [portfolio]\nstyle: [minimalism]\nfonts: [Suisse]\ngrid: Swiss 12-col\ngrid_type: [swiss]\nmood: [calm]\n---\nbody\n`;
  writeFileSync(join(dir, 'beta.md'), note('beta'));
  writeFileSync(join(dir, 'alpha.md'), note('alpha'));
  writeFileSync(join(dir, 'INDEX.md'), '# ignore');
  writeFileSync(join(dir, 'SCHEMA.md'), '# schema, bukan note');
  const index = buildIndex(dir);
  assert.equal(index.count, 2);
  assert.deepEqual(index.entries.map((e) => e.slug), ['alpha', 'beta']);
  rmSync(dir, { recursive: true, force: true });
});
