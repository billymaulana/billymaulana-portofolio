import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateAgent } from './validate-agents.mjs';

const ok = { name: 'awwwards-art-director', description: 'x', tools: 'Read, Bash, Agent', model: 'opus' };

test('agent valid lolos', () => {
  assert.deepEqual(validateAgent(ok, 'awwwards-art-director.md'), { valid: true, errors: [] });
});

test('name harus = filename', () => {
  const r = validateAgent(ok, 'lain.md');
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => /name/.test(e)));
});

test('name harus lowercase-hyphen', () => {
  const r = validateAgent({ ...ok, name: 'Bad_Name' }, 'Bad_Name.md');
  assert.equal(r.valid, false);
});

test('model harus valid', () => {
  const r = validateAgent({ ...ok, name: 'x', model: 'gpt' }, 'x.md');
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => /model/.test(e)));
});

test('description wajib', () => {
  const r = validateAgent({ name: 'x', model: 'opus', tools: 'Read' }, 'x.md');
  assert.equal(r.valid, false);
});

test('tools opsional (absen = inherit all) tetap valid', () => {
  const r = validateAgent({ name: 'x', description: 'y', model: 'opus' }, 'x.md');
  assert.deepEqual(r, { valid: true, errors: [] });
});
