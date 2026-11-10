// Merges a batch of new entries into data/words/.
//   npm run add -- path/to/batch.json --dry-run   (report problems, change nothing)
//   npm run add -- path/to/batch.json             (merge it)
// The batch is a JSON list of entries in the format described in README.md.
// Nothing is written unless the whole batch is valid. Style warnings (see
// docs/WRITING_GUIDE.md) are printed but do not block the merge: read them
// and fix the ones that are real.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { wordsDir, bucketOf, readAllWords, readWordlist, validateEntry } from './lib/words.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const batchPath = args.find((a) => !a.startsWith('--'));
if (!batchPath) {
  console.error('Usage: npm run add -- path/to/batch.json [--dry-run]');
  process.exit(1);
}

let batch;
try {
  batch = JSON.parse(readFileSync(batchPath, 'utf8'));
  if (!Array.isArray(batch)) throw new Error('the batch must be a JSON list of entries');
} catch (err) {
  console.error(`Cannot read ${batchPath}: ${err.message}`);
  process.exit(1);
}

const { files, errors } = readAllWords();
const existing = new Set();
for (const entries of files.values()) for (const e of entries) existing.add(e.word);

const inBatch = new Set();
for (const e of batch) {
  errors.push(...validateEntry(e));
  if (typeof e?.word !== 'string') continue;
  if (existing.has(e.word)) errors.push(`"${e.word}": already in the dictionary`);
  if (inBatch.has(e.word)) errors.push(`"${e.word}": appears twice in the batch`);
  inBatch.add(e.word);
}
if (errors.length) {
  console.error(`Batch rejected, ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

// ---- Style warnings -------------------------------------------------------
const list = readWordlist();
const SIMPLE_COUNT = 3000; // K–2 definitions should stick to the most common words
const simple = new Set(list.slice(0, SIMPLE_COUNT));
const tokens = (t) => t.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
const variants = (w) => {
  const out = [w, w.replace(/'s$/, '')];
  for (const suffix of ['s', 'es', 'ed', 'd', 'ing', 'ly', 'er', 'est', 'y', 'ful']) {
    if (w.endsWith(suffix)) {
      const stem = w.slice(0, -suffix.length);
      out.push(stem, stem + 'e', stem + 'y', stem.replace(/i$/, 'y'), stem.replace(/(.)\1$/, '$1'));
    }
  }
  return out;
};
const isSimple = (w) => w.length <= 2 || /'/.test(w) || variants(w).some((v) => simple.has(v));
const LIMITS = { easy: { def: 14, example: 12 }, more: { def: 26, example: 22 } };
const warnings = [];

for (const e of batch) {
  const names = [e.word, ...(e.forms ?? [])].map((n) => n.toLowerCase());
  const stem = e.word.toLowerCase().slice(0, Math.max(3, e.word.length - 3));
  if (!/^[A-Za-z]+(-[A-Za-z]+)*$/.test(e.say)) warnings.push(`"${e.word}": say "${e.say}" should be syllables joined by hyphens`);
  else if (e.say.includes('-') && e.say.split('-').filter((p) => p === p.toUpperCase()).length !== 1) {
    warnings.push(`"${e.word}": say "${e.say}" should have exactly one stressed syllable in CAPITALS`);
  }
  if (!list.includes(e.word.toLowerCase())) warnings.push(`"${e.word}": not in data/wordlist.txt (fine if intended)`);
  e.senses.forEach((s, i) => {
    const where = `"${e.word}" sense ${i + 1}`;
    for (const level of ['easy', 'more']) {
      const { def, examples } = s[level];
      if (tokens(def).length > LIMITS[level].def) warnings.push(`${where}: ${level} definition is long (${tokens(def).length} words)`);
      if (tokens(def).some((t) => names.includes(t))) warnings.push(`${where}: ${level} definition uses the word itself`);
      for (const ex of examples) {
        const t = tokens(ex);
        if (t.length > LIMITS[level].example) warnings.push(`${where}: ${level} example is long (${t.length} words): ${ex}`);
        if (!t.some((x) => names.includes(x)) && !ex.toLowerCase().includes(stem)) warnings.push(`${where}: ${level} example does not use the word: ${ex}`);
      }
    }
    const hard = [...new Set(tokens(s.easy.def).filter((t) => !isSimple(t)))];
    if (hard.length) warnings.push(`${where}: easy definition uses harder words: ${hard.join(', ')}`);
    const shared = s.easy.examples.filter((x) => s.more.examples.includes(x));
    if (shared.length) warnings.push(`${where}: the same example is used at both levels: ${shared[0]}`);
  });
}

if (warnings.length) console.log(`${warnings.length} style warning(s):\n` + warnings.map((w) => '  - ' + w).join('\n') + '\n');
if (dryRun) {
  console.log(`Dry run: ${batch.length} entries are valid. Nothing was changed.`);
  process.exit(0);
}

// ---- Merge ----------------------------------------------------------------
const touched = new Set();
for (const e of batch) {
  const bucket = bucketOf(e.word);
  if (!files.has(bucket)) files.set(bucket, []);
  files.get(bucket).push(e);
  touched.add(bucket);
}
for (const bucket of touched) {
  const entries = files.get(bucket).sort((a, b) => a.word.localeCompare(b.word));
  writeFileSync(join(wordsDir, `${bucket}.json`), JSON.stringify(entries, null, 2) + '\n');
}

console.log(`Added ${batch.length} words to ${touched.size} file(s). Dictionary now has ${existing.size + batch.length} words.`);
