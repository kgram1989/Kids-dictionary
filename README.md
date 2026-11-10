# Kids Dictionary

A dictionary for elementary students: big words explained in small words.

- Two reading levels for every meaning: **Grades K–2** and **Grades 3–5**
- Pronunciation shown as a simple respelling ("ih-NOR-mus") with a **Hear it** button
- Three example sentences for every meaning, each in a different situation
- Forgiving search (typos and word forms like "batting" still find the word) and A–Z browsing
- Kids can star words; stars are saved in the browser only, with no accounts and no tracking

## Run it locally

```
npm install
npm run dev
```

## Adding or fixing words

Words live in `data/words/`, in files named after each word's first two letters
(`enormous` is in `en.json`). To fix an entry, edit it there.

To add words:

```
npm run next -- 200                        # what to write next, from data/wordlist.txt
npm run add -- my-batch.json --dry-run     # check a batch without changing anything
npm run add -- my-batch.json               # merge it
```

- [`docs/WRITING_GUIDE.md`](docs/WRITING_GUIDE.md) has the entry format, the writing rules for both reading levels, the pronunciation key and the full workflow.
- `data/wordlist.txt` is the master list of about 10,300 words, most-used first. Words deliberately left out are recorded in `data/skipped.txt`.
- `data/derived.txt` lists about 450 words built from a root word (`unjust`, `sugarless`). They get a one-line entry under their root, shown as "Words made from …".
- `data/blocked.txt` lists words removed as unsuitable for children; the checks refuse them.
- For a word with no entry, the app shows a "may be made from" hint when it is a known word plus a common prefix or suffix.
- `npm run check` validates all the data. The same check runs on every pull request.

## Licences and credits

`data/wordlist.txt` is derived from research data by Kuperman, Stadthagen-Gonzalez &
Brysbaert (2012) and Brysbaert & Biemiller (2017), obtained from <https://osf.io/kz2px/>
under CC BY-NC-SA 4.0, and is shared under the same licence: non-commercial use, with
credit, and derived lists shared alike. Details are at the top of that file.

## Deploying

Pushing to `main` builds the site and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). One-time setup: in the repository's
**Settings → Pages**, set **Source** to **GitHub Actions**.
