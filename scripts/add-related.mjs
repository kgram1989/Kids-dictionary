// Adds one-line related entries to root words that already have an entry.
//   npm run add-related -- path/to/related.json --dry-run
//   npm run add-related -- path/to/related.json
// The file is a JSON list: [{ "root": "happy", "word": "unhappy", "def": "Not happy." }, ...]
// Nothing is written unless the whole file is valid.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { wordsDir, bucketOf, readAllWords, readDerived, validateEntry, crossCheck } from './lib/words.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const path = args.find((a) => !a.startsWith('--'));
if (!path) {
  console.error('Usage: npm run add-related -- path/to/related.json [--dry-run]');
  process.exit(1);
}
let items;
try {
  items = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(items)) throw new Error('the file must be a JSON list');
} catch (err) {
  console.error(`Cannot read ${path}: ${err.message}`);
  process.exit(1);
}

const { files, errors } = readAllWords();
const byWord = new Map();
for (const entries of files.values()) for (const e of entries) byWord.set(e.word.toLowerCase(), e);
const derived = readDerived();
const warnings = [];
const touched = new Set();
const words = (t) => String(t).toLowerCase().match(/[a-z]+/g) ?? [];

for (const it of items) {
  const root = byWord.get(String(it?.root).toLowerCase());
  if (!root) { errors.push(`"${it?.word}": root word "${it?.root}" has no entry yet`); continue; }
  (root.related ??= []).push({ word: it.word, def: it.def });
  touched.add(root);
  if (!(derived.get(root.word.toLowerCase()) ?? []).some((d) => d.word === it.word)) warnings.push(`"${it.word}": not listed under "${root.word}" in data/derived.txt (fine if intended)`);
  if (words(it.def).length > 12) warnings.push(`"${it.word}": definition is long (${words(it.def).length} words)`);
  if (words(it.def).includes(String(it.word).toLowerCase())) warnings.push(`"${it.word}": is used in its own definition`);
}
for (const e of touched) {
  errors.push(...validateEntry(e));
  e.related.sort((a, b) => a.word.localeCompare(b.word));
}
if (!errors.length) errors.push(...crossCheck([...byWord.values()]));
if (errors.length) {
  console.error(`Rejected, ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
if (warnings.length) console.log(`${warnings.length} warning(s):\n` + warnings.map((w) => '  - ' + w).join('\n') + '\n');
if (dryRun) {
  console.log(`Dry run: ${items.length} related words are valid. Nothing was changed.`);
  process.exit(0);
}
const buckets = new Set([...touched].map((e) => bucketOf(e.word)));
for (const b of buckets) writeFileSync(join(wordsDir, `${b}.json`), JSON.stringify(files.get(b), null, 2) + '\n');
console.log(`Added ${items.length} related words to ${touched.size} entries.`);
