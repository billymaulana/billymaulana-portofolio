import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const QUOTE = /\*"([\s\S]+?)"\*/g;
const ELISION = /\s*(?:…|\.\.\.)\s*/;

function normalize(text) {
  return text.replace(/\n[ \t]*>?[ \t]*/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * An ellipsis inside a quote marks an elided span of Billy's original words,
 * so each fragment between ellipses is matched against the sources on its own.
 */
export function findUnsourcedQuotes(md, sources) {
  const corpus = sources.map(normalize).join('\n');
  const unsourced = [];
  for (const match of md.matchAll(QUOTE)) {
    const quote = normalize(match[1]);
    const fragments = quote.split(ELISION).filter(Boolean);
    if (!fragments.every(f => corpus.includes(f))) unsourced.push(quote);
  }
  return unsourced;
}

function main(argv) {
  const [briefPath, ...sourcePaths] = argv.slice(2);
  if (!briefPath || sourcePaths.length === 0) {
    process.stderr.write('pakai: quote-check.mjs <brief.md> <sources...>\n');
    return 2;
  }
  const brief = readFileSync(briefPath, 'utf8');
  const unsourced = findUnsourcedQuotes(brief, sourcePaths.map(p => readFileSync(p, 'utf8')));
  const total = [...brief.matchAll(QUOTE)].length;
  if (unsourced.length === 0) {
    process.stdout.write(`quote-check: ${total} kutipan, semuanya ditemukan di ${sourcePaths.length} sumber\n`);
    return 0;
  }
  process.stdout.write(`quote-check: ${unsourced.length} dari ${total} kutipan tidak ditemukan di sumber\n`);
  for (const q of unsourced) process.stdout.write(`  ✖ "${q}"\n`);
  return 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv));
