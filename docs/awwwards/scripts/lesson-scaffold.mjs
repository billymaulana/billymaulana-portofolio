import { writeFileSync, appendFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const OUTCOMES = new Set(['shipped', 'slop-caught', 'iterated']);

function str(s) { return s == null ? '""' : JSON.stringify(String(s)); }

export function buildLesson(p) {
  const date = p.date ?? new Date().toISOString().slice(0, 10);
  const lines = [
    '---',
    'type: lesson',
    `date: ${date}`,
    `job: ${str(p.job)}`,
    `outcome: ${p.outcome ?? 'iterated'}`,
    p.score_before != null ? `score_before: ${p.score_before}` : null,
    p.score_after != null ? `score_after: ${p.score_after}` : null,
    '---',
    '',
    '## Yang berhasil',
    p.worked ?? '',
    '',
    '## Yang jadi slop + root cause',
    p.slop ?? '',
    '',
    '## Rule baru',
    p.rule ?? '(tidak ada)',
    '',
    '## Sinyal taste baru',
    p.taste ?? '(tidak ada)',
    '',
  ];
  return lines.filter((l) => l !== null).join('\n');
}

export function validateLesson(p) {
  const errors = [];
  if (!p.job) errors.push('missing job');
  if (!p.slug) errors.push('missing slug');
  if (p.outcome && !OUTCOMES.has(p.outcome)) errors.push(`invalid outcome: ${p.outcome}`);
  return { valid: errors.length === 0, errors };
}

export function appendRule(rulesPath, rule, date) {
  if (!rule) return false;
  appendFileSync(rulesPath, `\n- (${date}) ${rule}`);
  return true;
}

export function writeLesson(lessonsDir, rulesPath, p) {
  const { valid, errors } = validateLesson(p);
  if (!valid) throw new Error(`lesson invalid: ${errors.join('; ')}`);
  const date = p.date ?? new Date().toISOString().slice(0, 10);
  const path = join(lessonsDir, `${date}-${p.slug}.md`);
  writeFileSync(path, buildLesson(p));
  const ruleAppended = p.rule ? appendRule(rulesPath, p.rule, date) : false;
  return { path, ruleAppended };
}

function main() {
  const payloadPath = process.argv[2];
  if (!payloadPath || !existsSync(payloadPath)) {
    console.error('usage: lesson-scaffold.mjs <payload.json>');
    process.exit(1);
  }
  const root = process.cwd();
  const res = writeLesson(
    join(root, 'docs/awwwards/references/lessons'),
    join(root, 'docs/awwwards/anti-slop-rules.md'),
    JSON.parse(readFileSync(payloadPath, 'utf8')),
  );
  console.log(`lesson: ${res.path} | rule appended: ${res.ruleAppended}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
