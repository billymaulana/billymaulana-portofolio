import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildNote, writeNote, renderSections, appendSections } from './capture-scaffold.mjs';
import { parseFrontmatter, validateFrontmatter } from './taste-index.mjs';

const payload = {
  slug: 'demo-site',
  title: 'Demo Site',
  source_url: 'https://demo.example',
  captured: '2026-07-16',
  awwwards_status: 'SOTD',
  category: ['portfolio'],
  style: ['cinematic', 'minimalism'],
  fonts: ['PP Neue Montreal'],
  grid: 'Container 24px gutter; hero flush-left, statement 2-kolom 400px + 800px',
  grid_type: ['swiss', 'edge-anchored'],
  motion: ['scroll-scrub'],
  libraries: ['gsap', 'lenis'],
  mood: ['premium'],
  verdict: 'Bersih dan tegas.',
  influence: 'strengthen',
  rating: 8.4,
  thumb: 'assets/demo-site-desktop.png',
  typography: { primary: 'PP Neue Montreal', traits: ['oversized-display'] },
  color: { bg: '#0a0a0a', mode: 'dark' },
  analysis: { menarik: 'Kontras skala.', teknik: 'Pinned scroll.', timing: 'expo.inOut 1.2s.', premium: 'Ruang napas.' },
};

test('buildNote menghasilkan frontmatter yang lolos validasi Fase 1', () => {
  const md = buildNote(payload);
  const fm = parseFrontmatter(md);
  assert.deepEqual(validateFrontmatter(fm), { valid: true, errors: [] });
  assert.deepEqual(fm.category, ['portfolio']);
  assert.deepEqual(fm.style, ['cinematic', 'minimalism']);
  assert.equal(fm.thumb, 'assets/demo-site-desktop.png');
  assert.equal(fm.rating, 8.4);
});

test('buildNote memuat semua heading body', () => {
  const md = buildNote(payload);
  for (const h of ['## Apa yang Menarik', '## Teknik yang Diidentifikasi', '## Timing & Feel', '## Kenapa Terasa Premium']) {
    assert.ok(md.includes(h), `missing ${h}`);
  }
});

test('buildNote tanpa sections tidak memunculkan heading Section-by-Section', () => {
  const md = buildNote(payload);
  assert.ok(!md.includes('## Section-by-Section'), 'seharusnya absen saat sections kosong');
});

test('buildNote merender tabel per-section dan meng-escape pipe', () => {
  const md = buildNote({
    ...payload,
    sections: [
      { name: 'Hero', screenshot: 'assets/demo-site-hero.png', layout: 'counter-position', typography: 'PP Neue 200px', motion: 'text-reveal', color: 'mono + accent', concept: 'thesis', technique: 'SplitText' },
      { name: 'The Problem', screenshot: 'assets/demo-site-the-problem.png', layout: 'pinned', typography: 'body 18px', motion: 'expo.inOut | power3.out', color: 'dark', concept: 'tension' },
    ],
  });
  assert.ok(md.includes('## Section-by-Section'), 'heading section hilang');
  assert.ok(md.includes('### 1. Hero (`assets/demo-site-hero.png`)'), 'judul section 1 salah');
  assert.ok(md.includes('### 2. The Problem'), 'judul section 2 salah');
  assert.ok(md.includes('| Layout | counter-position |'), 'baris Layout hilang');
  assert.ok(md.includes('expo.inOut \\| power3.out'), 'pipe di cell tidak di-escape');
  assert.ok(md.includes('| Teknik | - |'), 'field kosong seharusnya jadi -');
});

test('buildNote merender typography multi-peran (secondary/label/accent/masthead)', () => {
  const md = buildNote({
    ...payload,
    typography: { primary: 'Obviously', masthead: 'MONOLOG wordmark', secondary: 'Khteka', label: 'Suisse Mono', accent: 'Serif italic', traits: ['brutalist-display'] },
  });
  for (const line of ['  masthead: "MONOLOG wordmark"', '  secondary: "Khteka"', '  label: "Suisse Mono"', '  accent: "Serif italic"']) {
    assert.ok(md.includes(line), `missing ${line}`);
  }
});

test('renderSections mengembalikan string kosong untuk array kosong/undefined', () => {
  assert.equal(renderSections([]), '');
  assert.equal(renderSections(undefined), '');
});

test('appendSections menyisipkan blok tanpa menghapus body existing + idempotent', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cap-'));
  const f = join(dir, 'note.md');
  writeFileSync(f, '---\ntype: reference\nslug: x\n---\n\n## Apa yang Menarik\nBODY LAMA YANG KAYA\n');
  const sections = [{ name: 'Hero', screenshot: 'assets/x-desktop.png', layout: 'counter', typography: 'Suisse', motion: 'reveal', color: 'dark', concept: 'thesis', technique: 'blend' }];
  const r1 = appendSections(f, sections);
  const out = readFileSync(f, 'utf8');
  assert.equal(r1.appended, true);
  assert.ok(out.includes('## Apa yang Menarik'), 'heading lama hilang');
  assert.ok(out.includes('BODY LAMA YANG KAYA'), 'body lama terhapus');
  assert.ok(out.includes('## Section-by-Section'), 'blok section tidak ditambah');
  assert.ok(out.includes('### 1. Hero (`assets/x-desktop.png`)'));
  appendSections(f, sections);
  const out2 = readFileSync(f, 'utf8');
  assert.equal(out2.match(/## Section-by-Section/g).length, 1, 'tidak idempotent — blok ganda');
  assert.ok(out2.includes('BODY LAMA YANG KAYA'), 'body hilang saat re-append');
  rmSync(dir, { recursive: true, force: true });
});

test('writeNote menolak payload tanpa field wajib', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cap-'));
  assert.throws(() => writeNote(dir, { slug: 'x' }), /invalid/i);
  rmSync(dir, { recursive: true, force: true });
});

test('writeNote menulis file yang bisa dibaca ulang', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cap-'));
  const p = writeNote(dir, payload);
  const fm = parseFrontmatter(readFileSync(p, 'utf8'));
  assert.equal(fm.slug, 'demo-site');
  rmSync(dir, { recursive: true, force: true });
});
