// Shared helpers for the word-data scripts.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bucketOf } from '../../src/bucket.js';

export { bucketOf };
export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const wordsDir = join(root, 'data', 'words');

export const POS = [
  'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition',
  'conjunction', 'interjection', 'article', 'number',
];

const isText = (v) => typeof v === 'string' && v.trim().length > 0;

// Returns a list of problems with one entry (empty if it is fine).
export function validateEntry(e) {
  const errors = [];
  if (!e || !isText(e.word)) return ['entry without a word'];
  const at = `"${e.word}"`;
  if (!bucketOf(e.word)) errors.push(`${at}: word has no letters`);
  if (!isText(e.say)) errors.push(`${at}: missing "say" (pronunciation)`);
  if (e.emoji !== undefined && !isText(e.emoji)) errors.push(`${at}: "emoji" must be text`);
  if (e.forms !== undefined && !(Array.isArray(e.forms) && e.forms.every(isText))) errors.push(`${at}: "forms" must be a list of words`);
  if (!Array.isArray(e.senses) || e.senses.length === 0) return [...errors, `${at}: needs at least one sense`];
  if (e.related !== undefined) {
    if (!Array.isArray(e.related)) errors.push(`${at}: "related" must be a list`);
    else {
      const seenRelated = new Set();
      for (const r of e.related) {
        if (!isText(r?.word) || !isText(r?.def)) { errors.push(`${at}: each related word needs "word" and "def"`); continue; }
        if (r.word === e.word || seenRelated.has(r.word)) errors.push(`${at}: related word "${r.word}" is repeated`);
        seenRelated.add(r.word);
      }
    }
  }
  e.senses.forEach((s, i) => {
    const where = `${at} sense ${i + 1}`;
    if (!POS.includes(s.pos)) errors.push(`${where}: unknown part of speech "${s.pos}"`);
    if (s.say !== undefined && !isText(s.say)) errors.push(`${where}: "say" must be text`);
    for (const level of ['easy', 'more']) {
      if (!isText(s[level]?.def)) errors.push(`${where}: missing ${level}.def`);
      const ex = s[level]?.examples;
      if (!Array.isArray(ex) || ex.length < 3 || !ex.every(isText)) errors.push(`${where}: ${level}.examples needs 3 sentences`);
      else if (new Set(ex).size !== ex.length) errors.push(`${where}: ${level}.examples has a repeated sentence`);
    }
  });
  return errors;
}

// Reads every word file. Returns { files: Map(bucket -> entries), errors }.
export function readAllWords() {
  const files = new Map();
  const errors = [];
  for (const file of readdirSync(wordsDir).filter((f) => f.endsWith('.json')).sort()) {
    try {
      const entries = JSON.parse(readFileSync(join(wordsDir, file), 'utf8'));
      if (!Array.isArray(entries)) throw new Error('must be a list of entries');
      files.set(file.replace('.json', ''), entries);
    } catch (err) {
      errors.push(`${file}: ${err.message}`);
    }
  }
  return { files, errors };
}

function readList(file) {
  const path = join(root, 'data', file);
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
}

export const readWordlist = () => readList('wordlist.txt');
export const readBlocked = () => new Set(readList('blocked.txt').map((w) => w.toLowerCase()));

// data/derived.txt: "derived word | root word | affix". Returns Map(root -> [{ word, affix }]).
export function readDerived() {
  const byRoot = new Map();
  for (const line of readList('derived.txt')) {
    const [word, root, affix] = line.split('|').map((x) => x.trim());
    if (!word || !root) continue;
    if (!byRoot.has(root)) byRoot.set(root, []);
    byRoot.get(root).push({ word, affix });
  }
  return byRoot;
}

// Checks that apply across the whole dictionary. `entries` is every entry.
export function crossCheck(entries) {
  const errors = [];
  const blocked = readBlocked();
  const headwords = new Set(entries.map((e) => e.word.toLowerCase()));
  const relatedOwner = new Map();
  for (const e of entries) {
    if (blocked.has(e.word.toLowerCase())) errors.push(`"${e.word}": is on the blocked list (data/blocked.txt)`);
    for (const r of e.related ?? []) {
      const w = String(r.word).toLowerCase();
      if (blocked.has(w)) errors.push(`"${e.word}": related word "${r.word}" is on the blocked list`);
      if (headwords.has(w)) errors.push(`"${e.word}": related word "${r.word}" already has its own full entry; remove one of them`);
      if (relatedOwner.has(w)) errors.push(`"${e.word}": related word "${r.word}" is also listed under "${relatedOwner.get(w)}"`);
      relatedOwner.set(w, e.word);
    }
  }
  return errors;
}
export const readSkipped = () => readList('skipped.txt').map((l) => l.split('|')[0].trim().toLowerCase());
