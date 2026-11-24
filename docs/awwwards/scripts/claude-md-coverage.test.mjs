import assert from 'node:assert/strict';
import test from 'node:test';
import { checkCoverage } from './claude-md-coverage.mjs';

const OLD = [
  '## Kept',
  'Baris pertama yang dipindah.',
  'Baris kedua yang dipindah.',
  '',
  '## Dropped',
  'Aturan yang tidak dibawa ke mana pun.',
  'Baris lain yang juga hilang.',
].join('\n');

test('covers a section moved verbatim', () => {
  const source = '# Proses\n\n## Kept\nBaris pertama yang dipindah.\nBaris kedua yang dipindah.\n';
  const old = OLD.split('\n## Dropped')[0];
  const { missing } = checkCoverage(old, [source], []);
  assert.deepEqual(missing, []);
});

test('reports a dropped section', () => {
  const source = '## Kept\nBaris pertama yang dipindah.\nBaris kedua yang dipindah.\n';
  const { missing } = checkCoverage(OLD, [source], []);
  assert.equal(missing.length, 1);
  assert.equal(missing[0].heading, '## Dropped');
  assert.match(missing[0].sample, /Aturan yang tidak dibawa/);
});

test('honours superseded headings', () => {
  const source = '## Kept\nBaris pertama yang dipindah.\nBaris kedua yang dipindah.\n';
  const { missing } = checkCoverage(OLD, [source], ['## Dropped']);
  assert.deepEqual(missing, []);
});

test('ignores whitespace differences', () => {
  const old = '## Spasi\nKalimat   dengan  spasi ganda.   \n\tBaris berindentasi.\n';
  const source = 'Kalimat dengan spasi ganda.\nBaris berindentasi.\n';
  const { missing } = checkCoverage(old, [source], []);
  assert.deepEqual(missing, []);
});
