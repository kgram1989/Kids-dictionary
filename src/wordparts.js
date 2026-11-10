// Works out whether a word we have no entry for looks like it is built from a
// word we do have, plus a common prefix or suffix. This is only ever shown as a
// hint ("might be made from"), because the pattern does not always hold.

export const PREFIXES = {
  un: 'not, or the opposite of',
  re: 'again',
  mis: 'wrongly',
  dis: 'not, or the opposite of',
  non: 'not',
  over: 'too much',
  under: 'below, or too little',
  pre: 'before',
};

export const SUFFIXES = {
  ly: 'in that way',
  ness: 'being like that',
  ful: 'full of it',
  less: 'without it',
  able: 'can be done',
  er: 'more, or someone or something that does it',
  est: 'the most',
  y: 'full of it, or like it',
  ish: 'a little like it',
  ment: 'the act or result of it',
  ing: 'doing it now',
  ed: 'it happened in the past',
  es: 'more than one, or does it',
  s: 'more than one, or does it',
};

// The spellings a root may have had before the suffix was added:
// hoping -> hope, happily -> happy, running -> run.
function stems(word, suffix) {
  if (!word.endsWith(suffix) || word.length - suffix.length < 3) return [];
  const base = word.slice(0, -suffix.length);
  const out = [base];
  if (base.endsWith('i')) out.push(base.slice(0, -1) + 'y');
  // A dropped "e" or a doubled letter only happens before endings that start with a vowel.
  if (/^[aeiouy]/.test(suffix) && suffix !== 'es') {
    out.push(base + 'e');
    if (/([^aeiou])\1$/.test(base)) out.push(base.slice(0, -1));
  }
  return out;
}

// `isBlocked` is checked at every step, so a blocked word cannot slip through with an
// extra ending ("smokers" is refused because "smoker" is blocked).
function stripSuffixes(word, has, isBlocked, depth) {
  if (isBlocked(word)) return null;
  if (has(word)) return { root: word, suffixes: [] };
  if (depth === 0) return null;
  for (const suffix of Object.keys(SUFFIXES)) {
    for (const stem of stems(word, suffix)) {
      const found = stripSuffixes(stem, has, isBlocked, depth - 1);
      if (found) return { root: found.root, suffixes: [...found.suffixes, suffix] };
    }
  }
  return null;
}

// Every shorter word that could be reached by taking endings and prefixes off `q`.
function reachable(q) {
  const seen = new Set([q]);
  let frontier = [q, ...Object.keys(PREFIXES).filter((p) => q.startsWith(p)).map((p) => q.slice(p.length))];
  for (let depth = 0; depth < 2; depth++) {
    const next = [];
    for (const word of frontier) {
      seen.add(word);
      for (const suffix of Object.keys(SUFFIXES)) for (const stem of stems(word, suffix)) next.push(stem);
      // also the plain spellings the strict rules skip, so "wines" still reaches "wine"
      for (const suffix of Object.keys(SUFFIXES)) if (word.endsWith(suffix)) next.push(word.slice(0, -suffix.length), word.slice(0, -suffix.length) + 'e');
    }
    frontier = next;
  }
  for (const word of frontier) seen.add(word);
  return seen;
}

// Returns { prefix, root, suffixes } or null. `has(word)` says whether a
// lower-case word has an entry. Simpler explanations are tried first.
export function wordParts(query, has, isBlocked = () => false) {
  const q = query.trim().toLowerCase();
  if (!/^[a-z]{4,}$/.test(q) || has(q)) return null;
  // Give no hint at all if the word could be a form of a blocked word.
  for (const word of reachable(q)) if (isBlocked(word)) return null;
  const prefixes = Object.keys(PREFIXES).filter((p) => q.startsWith(p) && q.length - p.length >= 3);
  for (const depth of [0, 1, 2]) {
    if (depth > 0) {
      const found = stripSuffixes(q, has, isBlocked, depth);
      if (found) return { prefix: '', ...found };
    }
    for (const prefix of prefixes) {
      const found = stripSuffixes(q.slice(prefix.length), has, isBlocked, depth);
      if (found) return { prefix, ...found };
    }
  }
  return null;
}
