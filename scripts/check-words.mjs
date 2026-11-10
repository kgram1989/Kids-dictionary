// Validates every entry in data/words/*.json and writes the search index
// to src/generated/index.json. Runs before `dev` and `build`, and in CI.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'data', 'words');
const POS = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection'];
const errors = [];
const index = [];
const seen = new Set();

const isText = (v) => typeof v === 'string' && v.trim().length > 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const letter = file.replace('.json', '');
  let entries;
  try {
    entries = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  } catch (e) {
    errors.push(`${file}: not valid JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(entries)) {
    errors.push(`${file}: must be a list of entries`);
    continue;
  }
  for (const e of entries) {
    const at = `${file} "${e?.word}"`;
    if (!isText(e.word)) { errors.push(`${file}: entry without a word`); continue; }
    if (e.word[0].toLowerCase() !== letter) errors.push(`${at}: belongs in ${e.word[0].toLowerCase()}.json`);
    if (seen.has(e.word)) errors.push(`${at}: duplicate word`);
    seen.add(e.word);
    if (!isText(e.say)) errors.push(`${at}: missing "say" (pronunciation)`);
    if (e.forms && !(Array.isArray(e.forms) && e.forms.every(isText))) errors.push(`${at}: "forms" must be a list of words`);
    if (!Array.isArray(e.senses) || e.senses.length === 0) { errors.push(`${at}: needs at least one sense`); continue; }
    e.senses.forEach((s, i) => {
      if (!POS.includes(s.pos)) errors.push(`${at} sense ${i + 1}: unknown part of speech "${s.pos}"`);
      for (const level of ['easy', 'more']) {
        if (!isText(s[level]?.def)) errors.push(`${at} sense ${i + 1}: missing ${level}.def`);
        const ex = s[level]?.examples;
        if (!Array.isArray(ex) || ex.length < 3 || !ex.every(isText)) errors.push(`${at} sense ${i + 1}: ${level}.examples needs 3 sentences`);
        else if (new Set(ex).size !== ex.length) errors.push(`${at} sense ${i + 1}: ${level}.examples has a repeated sentence`);
      }
    });
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
