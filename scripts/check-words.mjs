// Validates every entry in data/words/*.json and writes the search index
// to src/generated/index.json. Runs before `dev` and `build`, and in CI.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { root, bucketOf, readAllWords, readBlocked, validateEntry, crossCheck } from './lib/words.mjs';

const { files, errors } = readAllWords();
const index = [];
const seen = new Set();
const all = [];

for (const [bucket, entries] of files) {
  for (const e of entries) {
    const problems = validateEntry(e);
    errors.push(...problems.map((p) => `${bucket}.json ${p}`));
    if (typeof e?.word !== 'string') continue;
    if (bucketOf(e.word) !== bucket) errors.push(`${bucket}.json "${e.word}": belongs in ${bucketOf(e.word)}.json`);
    if (seen.has(e.word)) errors.push(`${bucket}.json "${e.word}": duplicate word`);
    seen.add(e.word);
    all.push(e);
    const item = { w: e.word, f: e.forms ?? [], e: e.emoji ?? '' };
    if (e.related?.length) item.r = e.related.map((r) => r.word);
    index.push(item);
  }
}

if (!errors.length) errors.push(...crossCheck(all));

if (errors.length) {
  console.error(`Word data has ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

index.sort((a, b) => a.w.localeCompare(b.w));
mkdirSync(join(root, 'src', 'generated'), { recursive: true });
writeFileSync(join(root, 'src', 'generated', 'index.json'), JSON.stringify(index));
writeFileSync(join(root, 'src', 'generated', 'blocked.json'), JSON.stringify([...readBlocked()].sort()));
const relatedCount = index.reduce((n, i) => n + (i.r?.length ?? 0), 0);
console.log(`Word data OK: ${index.length} words, ${relatedCount} related words.`);
