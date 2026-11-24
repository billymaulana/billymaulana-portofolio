import assert from 'node:assert/strict';
import test from 'node:test';
import { findUnsourcedQuotes } from './quote-check.mjs';

const SOURCE = 'verdict: *"masih jauh kualitas uinya motionnya effect"*\nBilly bilang liquid-2 "keren".\n';

test('accepts a quote present in a source', () => {
  const brief = '## 1. Suara Billy\n- *"masih jauh kualitas uinya motionnya effect"*\n';
  assert.deepEqual(findUnsourcedQuotes(brief, [SOURCE]), []);
});

test('flags a fabricated quote', () => {
  const brief = '- *"keren"*\n- *"saya suka biru neon di semua tempat"*\n';
  assert.deepEqual(findUnsourcedQuotes(brief, [SOURCE]), ['saya suka biru neon di semua tempat']);
});

test('normalizes whitespace and line breaks', () => {
  const brief = '> *"masih jauh kualitas\n> uinya   motionnya effect"*\n';
  const source = 'masih jauh\nkualitas uinya motionnya   effect';
  assert.deepEqual(findUnsourcedQuotes(brief, [source]), []);
});

test('matches each fragment of an elided quote separately', () => {
  const source = 'masih jauh kualitas uinya motionnya effect juga. foto saya thermal juga tidak rapih.';
  assert.deepEqual(findUnsourcedQuotes('*"masih jauh kualitas … tidak rapih"*', [source]), []);
  assert.deepEqual(findUnsourcedQuotes('*"masih jauh … sangat rapih"*', [source]), ['masih jauh … sangat rapih']);
});
