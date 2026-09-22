import { test } from 'node:test';
import assert from 'node:assert/strict';
import { queryIndex } from './taste-query.mjs';

const index = {
  entries: [
    { slug: 'a', title: 'Alpha', summary: 'liquid hero', style: ['cinematic'], mood: ['premium'], category: ['portfolio'], libraries: ['gsap'], path: 'references/library/a.md', thumb: null },
    { slug: 'b', title: 'Beta', summary: 'brutal grid', style: ['brutalism'], mood: ['tense'], category: ['agency'], libraries: ['lenis'], path: 'references/library/b.md', thumb: null },
    { slug: 'c', title: 'Cee', summary: 'calm editorial', style: ['editorial', 'minimalism'], mood: ['calm'], category: ['portfolio'], libraries: [], path: 'references/library/c.md', thumb: null },
  ],
};

test('filter by style', () => {
  assert.deepEqual(queryIndex(index, { style: 'brutalism' }).map((e) => e.slug), ['b']);
});

test('filter by mood (case-insensitive)', () => {
  assert.deepEqual(queryIndex(index, { mood: 'PREMIUM' }).map((e) => e.slug), ['a']);
});

test('filter by free text mencari slug/title/summary/style/mood', () => {
  assert.deepEqual(queryIndex(index, { text: 'editorial' }).map((e) => e.slug), ['c']);
});

test('kombinasi filter (AND)', () => {
  assert.deepEqual(queryIndex(index, { category: 'portfolio', mood: 'calm' }).map((e) => e.slug), ['c']);
});

test('tanpa filter mengembalikan semua', () => {
  assert.equal(queryIndex(index, {}).length, 3);
});
