import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const HEADING = /^#{2,3}\s/;
const COVERED_RATIO = 0.9;

function normalize(line) {
  return line.trim().replace(/\s+/g, ' ');
}

function splitSections(md) {
  const sections = [];
  let current = { heading: '(preamble)', lines: [] };
  for (const raw of md.split('\n')) {
    if (HEADING.test(raw)) {
      sections.push(current);
      current = { heading: normalize(raw), lines: [] };
      continue;
    }
    const line = normalize(raw);
    if (line && line !== '---') current.lines.push(line);
  }
  sections.push(current);
  return sections;
}

export function checkCoverage(oldMd, sources, superseded) {
  const corpus = sources.map(s => s.split('\n').map(normalize).join('\n')).join('\n');
  const skip = new Set(superseded.map(normalize));
  const missing = [];
  for (const section of splitSections(oldMd)) {
    if (skip.has(section.heading) || section.lines.length === 0) continue;
    const absent = section.lines.filter(line => !corpus.includes(line));
    const ratio = 1 - absent.length / section.lines.length;
    if (ratio < COVERED_RATIO) missing.push({ heading: section.heading, sample: absent[0] });
  }
  return { missing };
}

function main(argv) {
  const args = argv.slice(2);
  const superseded = [];
  const files = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--superseded') superseded.push(args[++i] ?? '');
    else files.push(args[i]);
  }
  const [oldPath, ...sourcePaths] = files;
  if (!oldPath || sourcePaths.length === 0) {
    process.stderr.write('pakai: claude-md-coverage.mjs <old.md> <new-files...> [--superseded "<heading>"]...\n');
    return 2;
  }
  const { missing } = checkCoverage(
    readFileSync(oldPath, 'utf8'),
    sourcePaths.map(p => readFileSync(p, 'utf8')),
    superseded,
  );
  if (missing.length === 0) {
    process.stdout.write(`claude-md-coverage: semua section ${oldPath} tercakup oleh ${sourcePaths.length} file\n`);
    return 0;
  }
  process.stdout.write(`claude-md-coverage: ${missing.length} section hilang\n`);
  for (const m of missing) process.stdout.write(`  ✖ ${m.heading}\n      contoh baris: ${m.sample}\n`);
  return 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv));
