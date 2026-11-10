# Writing guide for dictionary entries

This guide is for anyone (person or AI model) adding words to the Kids Dictionary.
The readers are children aged about 5 to 11. Every entry has to work for a child
reading alone, so the rules below matter more than they would in an adult dictionary.

Read the whole guide before writing your first entry. The workflow is at the end.

## What an entry looks like

```json
{
  "word": "migrate",
  "say": "MY-grayt",
  "emoji": "🦆",
  "forms": ["migrates", "migrated", "migrating"],
  "senses": [
    {
      "pos": "verb",
      "easy": {
        "def": "To move to a new place when the season changes.",
        "examples": [
          "Some birds migrate when it gets cold.",
          "Whales migrate to warm water.",
          "The geese migrate in the fall."
        ]
      },
      "more": {
        "def": "To travel from one place to another at certain times of year, as many animals do.",
        "examples": [
          "Monarch butterflies migrate thousands of miles to warmer places each fall.",
          "Huge herds of zebras migrate to find fresh grass.",
          "Some whales migrate thousands of miles every year."
        ]
      }
    }
  ]
}
```

| Field | Required | What it is |
|---|---|---|
| `word` | yes | The headword. Lower case unless it is always capitalised (`I`, `Monday`, `English`, `Christmas`). American spelling. |
| `say` | yes | The pronunciation respelling (see the key below). |
| `emoji` | no | One emoji that clearly pictures the first meaning. Leave it out if nothing fits well. |
| `forms` | no | Other spellings a child might type: plurals, verb forms, comparatives, irregular forms, British spellings. Lower case. |
| `senses` | yes | One to three meanings (four at most), the most common first. |
| `senses[].pos` | yes | `noun`, `verb`, `adjective`, `adverb`, `pronoun`, `preposition`, `conjunction`, `interjection`, `article` or `number`. |
| `senses[].say` | no | Only when this meaning is said differently from the headword's `say` (for example "wind" the verb: `wynd`). |
| `senses[].easy` | yes | Definition and three examples for Grades K–2. |
| `senses[].more` | yes | Definition and three examples for Grades 3–5. |
| `related` | no | One-line entries for words built from this word (see "Related words" below). |

## The two reading levels

Each meaning is written twice. The two versions describe the same meaning; the
second is not a different sense.

| | `easy` (Grades K–2, ages 5–8) | `more` (Grades 3–5, ages 8–11) |
|---|---|---|
| Definition length | Aim for 5–10 words, never more than 14 | Up to about 25 words |
| Vocabulary | Only very common words a 6-year-old knows | Everyday words; one harder word is fine if the sentence explains it |
| Content | The single core idea | The core idea plus one useful detail (when, why, what kind) |
| Example length | 4–9 words | 8–18 words |
| Example settings | Home, school, pets, play, food, weather | Wider: science, nature, sport, history, community, travel |

Examples of the difference:

- **fragile** — easy: "Easy to break." / more: "Easily broken, so it must be handled with care."
- **predict** — easy: "To say what you think will happen." / more: "To say what you think will happen in the future, using what you already know."
- **habitat** — easy: "The place where an animal or plant lives." / more: "The natural home of a plant or animal, where it finds what it needs to live."

## Definitions

1. **Use simpler words than the word being defined.** If a child has to look up a word
   in the definition, the definition has failed. The add script warns when an `easy`
   definition uses a word outside the 3,000 most common words; treat each warning as real
   unless the flagged word is plainly one a 6-year-old knows.
2. **Never use the headword or one of its forms in its own definition.** "Careful: being
   full of care" tells the child nothing.
3. **Do not define with a harder synonym.** "Enormous: immense" is wrong. "Very, very big" is right.
4. **Match the shape to the part of speech**, so the definition could replace the word in a sentence:
   - noun: a noun phrase — "A very tall hill."
   - verb: starts with "To" — "To keep safe."
   - adjective: a describing phrase — "Easy to break." / "Not the same."
   - adverb: "In a fast way."
5. **Function words** (the, of, because, could, this) cannot be defined by meaning. Say what
   the word does: "A word used to show that something belongs to someone." Then let the
   examples do most of the work.
6. **One idea per definition.** If you need "also" or a semicolon in the `easy` definition,
   it is probably two senses, or the second idea belongs only in `more`.
7. Start with a capital letter and end with a full stop.
8. **Write every definition yourself.** Do not copy or closely paraphrase definitions from
   published dictionaries.

## Meanings (senses)

- Include the meanings a child is likely to meet, most common first. Most words need one
  or two. Leave out rare, technical, old-fashioned and adult meanings.
- A different part of speech is a different sense ("bat" the animal, "bat" the stick,
  "to bat" the ball).
- Do not split hairs: if two meanings would get nearly the same `easy` definition, they
  are one sense.

## Example sentences

Each meaning needs three examples at each level, six in total, all different.

1. **Each example uses the headword or a listed form, in the meaning and part of speech
   being defined.** An example for "balance" the verb must not use "balance" the noun.
2. **Each of the three shows a different situation.** For "protect": a helmet protecting
   a head, a dog protecting a house, a law protecting animals. Not three sentences about
   helmets.
3. **The sentence should help show the meaning.** "The fragile cup broke" teaches
   something; "I saw a fragile thing" does not.
4. **Sound like real speech.** Read it aloud. If nobody would say it, rewrite it.
5. **Keep the content safe and calm**: no violence, romance, frightening scenes, brands,
   real people, or anything that preaches. Do not always make the same kind of person
   the doctor, the helper or the one in trouble.
6. The `easy` and `more` examples must be different sentences, not the same sentence
   lengthened.
7. Use the inflected forms naturally ("migrated", "migrates"), and make sure every form
   you use is listed in `forms`.

## Pronunciation respelling (`say`)

Use general American pronunciation. Split the word into syllables with hyphens and put
the stressed syllable in CAPITALS. One-syllable words are all lower case (`brayv`, `bat`).
Exactly one syllable is in capitals, even in long words.

| Sound | Write | Example |
|---|---|---|
| c**a**t | `a` | bat → `bat` |
| d**ay** | `ay` | brave → `brayv` |
| c**ar**e | `air` | compare → `kum-PAIR` |
| c**ar** | `ar` | argue → `AR-gyoo` |
| f**a**ther | `ah` | calm → `kahm` |
| s**aw** | `aw` | yawn → `yawn` |
| b**e**d | `e` | effort → `EF-ert` |
| s**ee** | `ee` | eager → `EE-ger` |
| n**ear** | `eer` | fierce → `feerss` |
| h**er**, b**ir**d | `er` | urgent → `ER-junt` |
| s**i**t | `i` (`ih` when the syllable would otherwise be a bare vowel or end in it) | invent → `in-VENT`, enormous → `ih-NOR-mus` |
| m**y** | `y` after a consonant, `eye` on its own | silent → `SY-lunt`, island → `EYE-lund` |
| h**o**t | `o` | fossil → `FOSS-ul` |
| g**o** | `oh` | ocean → `OH-shun` |
| f**or** | `or` | orbit → `OR-bit` |
| m**oo**n | `oo` | zoom → `zoom` |
| b**oo**k, p**u**t | `uu` | cookie → `KUUK-ee` |
| **u**se | `yoo` | unique → `yoo-NEEK` |
| c**u**p, **a**bout (also any weak, unstressed vowel) | `u` inside a syllable, `uh` at the end of one | justice → `JUS-tiss`, adventure → `ad-VEN-cher`, banana → `buh-NAN-uh` |
| c**ow** | `ow` | proud → `prowd` |
| b**oy** | `oy` | loyal → `LOY-ul` |
| **ch**in / **sh**ip / **th**in, **th**is | `ch` / `sh` / `th` | gather → `GATH-er` |
| mea**s**ure | `zh` | treasure → `TREZH-er` |
| **j**am, gentle | `j` | gentle → `JEN-tul` |
| **g**o | `g` (always hard) | guess → `gess` |
| **c**at, **k**ite | `k` | curious → `KYUR-ee-us` |
| **s**un (never the z sound) | `s`, or `ss` at the end of a syllable | distance → `DIS-tunss` |
| **qu**een / bo**x** | `kw` / `ks` | quiet → `KWY-ut` |
| si**ng** | `ng` | jungle → `JUNG-gul` |

Check each respelling by saying it aloud from the spelling alone. Common endings:
`-tion` → `shun`, `-ture` → `cher`, `-ous` → `us`, `-able` → `uh-bul`, `-ment` → `munt`.

If a word is said in two ways with different meanings (wind, read, tear, bow, close),
put the first meaning's pronunciation in the entry's `say` and add `say` to the sense
that differs.

## Related words (one-line entries)

Some words are built from a root word with a prefix or suffix and mean just what their
parts say: *unjust* is "not just", *sugarless* is "without sugar". The ones children
are likely to meet but that are too rare for a full entry are listed in
`data/derived.txt`. They get a single line under their root word instead:

```json
{
  "word": "sugar",
  "say": "SHUUG-er",
  "senses": [ ... ],
  "related": [
    { "word": "sugarless", "def": "Without sugar." },
    { "word": "sugary", "def": "Full of sugar; very sweet." }
  ]
}
```

The app shows them under "Words made from sugar", and search finds them.

- `npm run next` marks a word that has related words due, for example
  `sugar   + related: sugarless, sugary`. Write them in the root's entry as you write it.
- **One short definition for both reading levels**: 12 words at most, in words a
  6-year-old knows. Using the root word is fine and usually best ("Not tidy.", "To heat again.").
- No examples, pronunciation or forms.
- **Check that the simple meaning is true.** If the word does not mean what its parts
  suggest, leave it out of `related` and say so in your report.
- A word that already has a full entry must not also be a related word; the check rejects it.
- To add related words to roots that are already written, put them in a JSON list of
  `{ "root": ..., "word": ..., "def": ... }` and run `npm run add-related -- <file>`
  (with `--dry-run` first). `npm run related` lists the ones that are due.

Words a child types that are in neither list may still get an automatic "may be made
from" hint in the app (for example *unkindly* → un- + kind + -ly). That needs no
writing. Words in `data/blocked.txt` never get an entry, a related line or a hint.

## Which words to write, and which to skip

Work through `data/wordlist.txt` in order (`npm run next` shows what is next). The list
was built automatically, so it contains words that should not get an entry. Skip a word,
and record it in `data/skipped.txt` as `word | reason`, when it is:

- **Not suitable for children**: swearing and crude slang, slurs and demeaning names for
  groups of people, sexual words, nudity and private body parts, alcohol, tobacco, drugs and gambling, and violent crime
  or cruelty (murder, torture, kidnapping and the like). Reason: `not suitable for
  children`. The list was reviewed for these and about 175 words were removed, but if
  one was missed, skip it. Keep these topics out of definitions and examples for other
  words too: "smoke" is what a fire makes, and a "bar" is a long piece of something.
- **Only a form of another word** with no meaning of its own (`dancing` as in "is
  dancing"). Reason: `a form of dance`. Make sure the base word lists it in `forms`.
  But write a full entry when the form is a word in its own right that a child would
  look up (`building`, `interesting`, `tired`, `feeling`).
  Adverbs ending in *-ly* that are in the list (`carefully`, `finally`, `usually`) were
  put there on purpose and always get a full entry.
- **A name, an abbreviation or a spelling mistake.** Reason: `a name`, and so on.

Do **not** skip a word just because the topic is serious. Children's dictionaries
include words like *die*, *war*, *gun*, *sick* and *afraid*. Define them plainly and
calmly, and keep the examples gentle.

If the list gives a word in lower case that should be capitalised (`monday`,
`christmas`), write the entry with the capital; it still counts as done.

## Workflow for adding a batch

1. `npm ci` if `node_modules` is missing, then `npm run next -- 200` to see the next words
   (and any related words to write with them).
2. Decide which of them to skip and add those lines to `data/skipped.txt`.
3. Write the entries about 40 at a time, as a JSON list in a temporary file **outside
   the repository** (a scratch or temp directory).
4. `npm run add -- <file> --dry-run`. Fix every error. Read every style warning and fix
   the ones that are real; a warning that is a false alarm can be left.
5. Re-read each entry once against the checklist below, as if you were the child.
6. `npm run add -- <file>` to merge it into `data/words/`.
7. Repeat steps 3–6 until the session's words are done, then run `npm run build`. It must pass.
8. Commit (`Add 200 words: able to zoo`, for example) and push to the branch you were
   given. Open a pull request only if asked to.
9. Add every entry you are unsure about (serious topics, loose wording, unusual
   respellings, style warnings you left in place, forms that duplicate another entry)
   to `data/unsure.txt` as `word | what to check`, so a person can review them later.
   Delete a line only once that entry has been reviewed.
10. Report: how many words were added, which were skipped and why, and any entries you
    are unsure about (the same ones you put in `data/unsure.txt`).

About 200–300 words is a sensible amount for one session. Stop and report at that point
rather than letting the quality drop. To fix an entry that is already merged, edit its
file in `data/words/` directly (the file is named after the word's first two letters).

### Checklist for each entry

- [ ] Could a 6-year-old understand the `easy` definition without help?
- [ ] Does neither definition use the word itself or a harder synonym?
- [ ] Do all six examples use the word in the meaning being defined?
- [ ] Are the three examples at each level set in three different situations?
- [ ] Said aloud from the respelling alone, does it sound like the word, with the stress in the right place?
- [ ] Are all the forms used in the examples listed in `forms`?
- [ ] Is every meaning one a child would actually meet?

### Do not

- Reorder or edit `data/wordlist.txt`.
- Change the scripts, the app or the entry format as part of a word batch. If the format
  cannot express something, say so in your report instead.
- Rewrite existing entries, other than adding a missing form or fixing a clear mistake
  (and say so in the report).
