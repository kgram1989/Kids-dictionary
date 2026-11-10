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

Words live in `data/words/`, one file per starting letter. Each entry looks like this:

```json
{
  "word": "enormous",
  "say": "ih-NOR-mus",
  "emoji": "🐘",
  "forms": [],
  "senses": [
    {
      "pos": "adjective",
      "easy": {
        "def": "Very, very big.",
        "examples": ["An elephant is enormous.", "We ate an enormous pizza.", "The whale has an enormous tail."]
      },
      "more": {
        "def": "Much bigger than usual; huge.",
        "examples": [
          "An enormous wave crashed over the rocks.",
          "The library has an enormous collection of books.",
          "An enormous tree had fallen across the road."
        ]
      }
    }
  ]
}
```

- `easy` is the Grades K–2 wording, `more` is the Grades 3–5 wording.
- Each level needs three example sentences, set in different situations.
- `forms` lists other spellings a child might search for ("ran", "running").
- `emoji` and `forms` are optional. A word with several meanings has several `senses`.

Run `npm run check` to validate the data. The same check runs on every pull request.

## Deploying

Pushing to `main` builds the site and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). One-time setup: in the repository's
**Settings → Pages**, set **Source** to **GitHub Actions**.
