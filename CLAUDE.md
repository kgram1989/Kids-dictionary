# Kids Dictionary

A dictionary website for elementary students (ages 5–11). It is a static React + Vite
site published to GitHub Pages from `main`. All content is in the repository; there is
no server or database.

## Layout

- `data/words/*.json` — the dictionary entries, in files named after each word's first two letters (`camouflage` → `ca.json`).
- `data/wordlist.txt` — the master list of about 15,200 words to add, most-used first (the first 10,900 are written; about 4,300 from children's books were added after). Do not reorder it.
- `data/skipped.txt` — words from the list that were deliberately left out, with reasons.
- `data/derived.txt` — words built from a root word (`unjust`, `sugarless`) that get a one-line `related` entry under their root, not a full entry.
- `data/blocked.txt` — words removed as unsuitable for children. They must never get an entry, a related line or a hint; the check enforces this. Only the owner changes this file.
- `data/unsure.txt` — entries that were added but need a second look, as `word | what to check`. Add to it every session; only delete a line after review.
- `docs/WRITING_GUIDE.md` — the rules for writing entries, and the step-by-step workflow.
- `scripts/` — `check-words.mjs` (validation and search index), `next-words.mjs`, `add-words.mjs`.
- `src/` — the app.

## Commands

- `npm ci` — install.
- `npm run next -- 200` — show progress and the next 200 words to write.
- `npm run add -- <batch.json> --dry-run` — validate a batch and print style warnings without changing anything.
- `npm run add -- <batch.json>` — merge a batch into `data/words/`.
- `npm run related` — list one-line related entries that are due (their root word is already written).
- `npm run add-related -- <related.json>` — add related entries to roots that are already written (`--dry-run` to check first).
- `npm run check` — validate all word data.
- `npm run build` — validate and build the site. Must pass before every commit.

## The main ongoing job: adding words

The goal is to work through `data/wordlist.txt` until the dictionary has about 14,500
words. When asked to "add the next words" (or similar):

1. Read `docs/WRITING_GUIDE.md` in full first. Its rules are requirements, not suggestions.
2. Follow the workflow at the end of that guide exactly.
3. Add about 200–300 words per session unless told otherwise, then stop and report.

Quality matters more than speed: nobody reviews every entry, and the readers are young
children. Each meaning needs a Grades K–2 definition, a Grades 3–5 definition, and three
example sentences at each level in three different situations. Write everything yourself;
do not copy from published dictionaries.

## Rules for any change

- Keep word batches separate from changes to the app, scripts or entry format.
- If the entry format changes, update `scripts/lib/words.mjs` (validation), the README and the writing guide together.
- Starred words and the reading level are stored only in the child's browser. Do not add accounts, analytics, ads or external links.
