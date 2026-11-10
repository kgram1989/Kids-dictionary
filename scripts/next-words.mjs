// Shows progress through data/wordlist.txt and prints the next words to write.
//   npm run next            -> the next 50 words
//   npm run next -- 300     -> the next 300 words
import { readAllWords, readWordlist, readSkipped } from './lib/words.mjs';

const count = Number(process.argv[2] ?? 50);
const list = readWordlist();
const skipped = new Set(readSkipped());
const done = new Set();
for (const entries of readAllWords().files.values()) for (const e of entries) done.add(e.word.toLowerCase());

const todo = list.filter((w) => !done.has(w) && !skipped.has(w));
const listDone = list.filter((w) => done.has(w)).length;
console.error(
  `Dictionary: ${done.size} words. Word list: ${list.length} total, ${listDone} written, ` +
  `${list.filter((w) => skipped.has(w)).length} skipped, ${todo.length} to go.`,
);
console.log(todo.slice(0, count).join('\n'));
