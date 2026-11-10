import { useEffect, useState } from 'react';
import index from './generated/index.json';
import { bucketOf } from './bucket.js';

export { index };

// Each word file becomes its own chunk, loaded only when needed.
const loaders = import.meta.glob('../data/words/*.json');
const cache = {};

function loadBucket(bucket) {
  const key = `../data/words/${bucket}.json`;
  if (!loaders[key]) return Promise.resolve([]);
  cache[bucket] ??= loaders[key]().then((m) => m.default);
  return cache[bucket];
}

export const letterOf = (word) => bucketOf(word)[0] ?? '';

export async function loadWord(word) {
  const entries = await loadBucket(bucketOf(word));
  return entries.find((e) => e.word === word) ?? null;
}

export const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

function editDistance(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

// Forgiving search: exact word or word form, then "starts with",
// then close spellings (so "elefant" style typos still find the word).
// Lower-cased word and forms for each index entry, worked out once.
const searchNames = index.map((item) => ({ item, names: [item.w, ...item.f].map((n) => n.toLowerCase()) }));

export function search(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  const allowed = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;
  for (const { item, names } of searchNames) {
    let score = Infinity;
    if (names.includes(q)) score = 0;
    else if (names[0].startsWith(q)) score = 1;
    else if (names.some((n) => n.startsWith(q))) score = 2;
    else if (q.length >= 3) {
      const close = names.filter((n) => Math.abs(n.length - q.length) <= allowed);
      const d = Math.min(Infinity, ...close.map((n) => editDistance(q, n)));
      if (d <= allowed) score = 2 + d;
    }
    if (score < Infinity) scored.push({ item, score });
  }
  scored.sort((a, b) => a.score - b.score || a.item.w.localeCompare(b.item.w));
  return scored.slice(0, limit).map((s) => s.item);
}

// A value kept in the browser's own storage. Nothing leaves the device.
export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage may be blocked; the app still works for this visit */
    }
  }, [key, value]);
  return [value, setValue];
}

export function useHashRoute() {
  const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text) {
  if (!canSpeak) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export function wordOfTheDay() {
  const day = Math.floor(Date.now() / 86400000);
  return index[day % index.length];
}

export const POS_LABELS = {
  noun: 'naming word (noun)',
  verb: 'doing word (verb)',
  adjective: 'describing word (adjective)',
  adverb: 'how word (adverb)',
  pronoun: 'pronoun',
  preposition: 'preposition',
  conjunction: 'joining word (conjunction)',
  interjection: 'exclamation (interjection)',
  article: 'article',
  number: 'number word',
};
