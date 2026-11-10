import React, { useEffect, useState } from 'react';
import {
  index, LETTERS, POS_LABELS, canSpeak, loadWord, search, speak,
  useHashRoute, useStored, wordOfTheDay,
} from './lib.js';

const byWord = new Map(index.map((i) => [i.w, i]));

export default function App() {
  const route = useHashRoute();
  const [level, setLevel] = useStored('kd.level', 'easy');
  const [stars, setStars] = useStored('kd.stars', []);

  const toggleStar = (word) =>
    setStars((s) => (s.includes(word) ? s.filter((w) => w !== word) : [...s, word]));

  const [page, arg] = route.split('/');
  let content;
  if (page === 'word' && arg) {
    content = <WordPage key={arg} word={arg} level={level} starred={stars.includes(arg)} onStar={toggleStar} />;
  } else if (page === 'letter' && arg) {
    content = <LetterPage letter={arg} />;
  } else if (page === 'stars') {
    content = <StarsPage stars={stars} onStar={toggleStar} />;
  } else {
    content = <HomePage />;
  }

  return (
    <>
      <header className="top no-print">
        <a className="brand" href="#/">📖 Kids Dictionary</a>
        <nav>
          <div className="level" role="group" aria-label="Reading level">
            <button aria-pressed={level === 'easy'} onClick={() => setLevel('easy')}>Grades K–2</button>
            <button aria-pressed={level === 'more'} onClick={() => setLevel('more')}>Grades 3–5</button>
          </div>
          <a className="stars-link" href="#/stars">⭐ My Words{stars.length ? ` (${stars.length})` : ''}</a>
        </nav>
      </header>
      <main>
        <div className="no-print">
          <SearchBox />
          <Alphabet current={page === 'letter' ? arg : page === 'word' && arg ? arg[0] : ''} />
        </div>
        {content}
      </main>
      <footer className="no-print">Your starred words are saved only on this device.</footer>
    </>
  );
}

function SearchBox() {
  const [q, setQ] = useState('');
  const results = search(q);
  const go = (word) => {
    setQ('');
    window.location.hash = `#/word/${encodeURIComponent(word)}`;
  };
  return (
    <form
      className="search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (results[0]) go(results[0].w);
      }}
    >
      <label htmlFor="q" className="sr-only">Type a word</label>
      <input
        id="q"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Type a word…"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
      />
      {q.trim() && (
        <ul className="results">
          {results.length === 0 && <li className="none">We don't have that word yet. Check the spelling, or try another word.</li>}
          {results.map((r) => (
            <li key={r.w}>
              <button type="button" onClick={() => go(r.w)}>
                <span aria-hidden="true">{r.e}</span> {r.w}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

function Alphabet({ current }) {
  const has = new Set(index.map((i) => i.w[0]));
  return (
    <nav className="alphabet" aria-label="Browse by letter">
      {LETTERS.map((l) =>
        has.has(l) ? (
          <a key={l} href={`#/letter/${l}`} aria-current={current === l ? 'page' : undefined}>{l.toUpperCase()}</a>
        ) : (
          <span key={l}>{l.toUpperCase()}</span>
        ),
      )}
    </nav>
  );
}

function WordLink({ item }) {
  return (
    <a className="chip" href={`#/word/${encodeURIComponent(item.w)}`}>
      <span aria-hidden="true">{item.e}</span> {item.w}
    </a>
  );
}

function HomePage() {
  const today = wordOfTheDay();
  const random = () => {
    const pick = index[Math.floor(Math.random() * index.length)];
    window.location.hash = `#/word/${encodeURIComponent(pick.w)}`;
  };
  return (
    <section className="home">
      <h1>Big words, small words.</h1>
      <p className="lead">Look up a word to see what it means, hear it, and read it in a sentence.</p>
      <div className="cards">
        <a className="card" href={`#/word/${encodeURIComponent(today.w)}`}>
          <span className="card-label">Word of the day</span>
          <span className="card-word"><span aria-hidden="true">{today.e}</span> {today.w}</span>
        </a>
        <button className="card" onClick={random}>
          <span className="card-label">Feeling lucky?</span>
          <span className="card-word"><span aria-hidden="true">🎲</span> Surprise me</span>
        </button>
      </div>
    </section>
  );
}

function LetterPage({ letter }) {
  const words = index.filter((i) => i.w[0] === letter);
  return (
    <section>
      <h1>Words that start with {letter.toUpperCase()}</h1>
      {words.length ? (
        <div className="chips">{words.map((i) => <WordLink key={i.w} item={i} />)}</div>
      ) : (
        <p>No words here yet.</p>
      )}
    </section>
  );
}

function WordPage({ word, level, starred, onStar }) {
  const [entry, setEntry] = useState(undefined);
  useEffect(() => {
    let live = true;
    loadWord(word).then((e) => live && setEntry(e), () => live && setEntry(null));
    return () => { live = false; };
  }, [word]);

  if (entry === undefined) return <p>Loading…</p>;
  if (entry === null) {
    return (
      <section>
        <h1>We don't have “{word}” yet.</h1>
        <p><a href="#/">Go back home</a></p>
      </section>
    );
  }
  return (
    <article className="entry">
      <div className="entry-head">
        <h1>{entry.emoji && <span aria-hidden="true">{entry.emoji} </span>}{entry.word}</h1>
        <button className="star" aria-pressed={starred} onClick={() => onStar(entry.word)}>
          {starred ? '⭐ Saved' : '☆ Save'}
        </button>
      </div>
      <p className="say">
        {canSpeak && (
          <button className="speak" onClick={() => speak(entry.word)} aria-label={`Hear the word ${entry.word}`}>🔊 Hear it</button>
        )}
        <span>Say it: <strong>{entry.say}</strong></span>
      </p>
      <ol className={entry.senses.length === 1 ? 'senses single' : 'senses'}>
        {entry.senses.map((s, i) => (
          <li key={i}>
            <span className="pos">{POS_LABELS[s.pos] ?? s.pos}</span>
            <p className="def">
              {s[level].def}
              {canSpeak && (
                <button className="speak small" onClick={() => speak(s[level].def)} aria-label="Hear the meaning">🔊</button>
              )}
            </p>
            <p className="example">
              “{s[level].example}”
              {canSpeak && (
                <button className="speak small" onClick={() => speak(s[level].example)} aria-label="Hear the sentence">🔊</button>
              )}
            </p>
          </li>
        ))}
      </ol>
    </article>
  );
}

function StarsPage({ stars, onStar }) {
  const sorted = [...stars].sort((a, b) => a.localeCompare(b));
  return (
    <section>
      <h1>⭐ My Words</h1>
      {sorted.length === 0 ? (
        <p>You have no saved words yet. Tap “☆ Save” on a word to keep it here.</p>
      ) : (
        <>
          <ul className="star-list">
            {sorted.map((w) => (
              <li key={w}>
                <WordLink item={byWord.get(w) ?? { w, e: '' }} />
                <button className="remove no-print" onClick={() => onStar(w)} aria-label={`Remove ${w}`}>✕</button>
              </li>
            ))}
          </ul>
          <button className="print no-print" onClick={() => window.print()}>🖨️ Print my words</button>
        </>
      )}
    </section>
  );
}
