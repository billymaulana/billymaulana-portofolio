import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildLesson, validateLesson, writeLesson } from './lesson-scaffold.mjs';

const p = {
  date: '2026-07-16', slug: 'audio-gate', job: 'capture hashgraphvc', outcome: 'iterated',
  score_before: 6, score_after: 8.4, worked: 'X', slop: 'Y',
  rule: 'Masuk audio/entry-gate dulu sebelum screenshot situs award.', taste: 'Z',
};

test('buildLesson punya frontmatter + semua heading', () => {
  const md = buildLesson(p);
  assert.ok(md.startsWith('---\ntype: lesson'));
  for (const h of ['## Yang berhasil', '## Yang jadi slop + root cause', '## Rule baru', '## Sinyal taste baru']) {
    assert.ok(md.includes(h), `missing ${h}`);
  }
});

test('validateLesson menolak tanpa job/slug', () => {
  assert.equal(validateLesson({ slug: 'x' }).valid, false);
  assert.equal(validateLesson({ job: 'x' }).valid, false);
});

test('validateLesson menolak outcome invalid', () => {
  assert.equal(validateLesson({ job: 'x', slug: 'y', outcome: 'bad' }).valid, false);
});

test('writeLesson menulis file + append rule ke rules', () => {
  const dir = mkdtempSync(join(tmpdir(), 'les-'));
  const rules = join(dir, 'rules.md');
  writeFileSync(rules, '# Rules\n');
  const res = writeLesson(dir, rules, p);
  assert.ok(res.ruleAppended);
  assert.ok(readFileSync(res.path, 'utf8').includes('## Rule baru'));
  assert.ok(readFileSync(rules, 'utf8').includes('Masuk audio/entry-gate dulu'));
  rmSync(dir, { recursive: true, force: true });
});
