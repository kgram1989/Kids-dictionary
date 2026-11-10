// Validates every entry in data/words/*.json and writes the search index
// to src/generated/index.json. Runs before `dev` and `build`, and in CI.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { root, bucketOf, readAllWords, validateEntry } from './lib/words.mjs';

const { files, errors } = readAllWords();
const index = [];
const seen = new Set();

for (const [bucket, entries] of files) {
  for (const e of entries) {
    const problems = validateEntry(e);
    errors.push(...problems.map((p) => `${bucket}.json ${p}`));
    if (typeof e?.word !== 'string') continue;
    if (bucketOf(e.word) !== bucket) errors.push(`${bucket}.json "${e.word}": belongs in ${bucketOf(e.word)}.json`);
    if (seen.has(e.word)) errors.push(`${bucket}.json "${e.word}": duplicate word`);
    seen.add(e.word);
    index.push({ w: e.word, f: e.forms ?? [], e: e.emoji ?? '' });
  }
}

if (errors.length) {
  console.error(`Word data has ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

index.sort((a, b) => a.w.localeCompare(b.w));
mkdirSync(join(root, 'src', 'generated'), { recursive: true });
writeFileSync(join(root, 'src', 'generated', 'index.json'), JSON.stringify(index));
console.log(`Word data OK: ${index.length} words.`);
