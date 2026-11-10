// Shows progress on one-line related entries (data/derived.txt) and lists the ones
// that are due: their root word already has an entry but they are not written yet.
//   npm run related            -> the first 50 roots with related words due
//   npm run related -- 200     -> the first 200
import { readAllWords, readDerived } from './lib/words.mjs';

const count = Number(process.argv[2] ?? 50);
const derived = readDerived();
const written = new Map();
for (const entries of readAllWords().files.values()) {
  for (const e of entries) written.set(e.word.toLowerCase(), new Set((e.related ?? []).map((r) => r.word.toLowerCase())));
}

let total = 0, done = 0;
const due = [];
for (const [root, list] of derived) {
  total += list.length;
  const have = written.get(root);
  if (!have) continue;
  const missing = list.filter((d) => !have.has(d.word));
  done += list.length - missing.length;
  if (missing.length) due.push(`${root}: ${missing.map((d) => `${d.word} (${d.affix})`).join(', ')}`);
}
const dueWords = due.reduce((n, l) => n + l.split(',').length, 0);
console.error(`Related words: ${total} listed, ${done} written, ${dueWords} due now (root already has an entry), ${total - done - dueWords} waiting for their root.`);
console.log(due.slice(0, count).join('\n'));
