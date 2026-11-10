// Words are stored in small files named after their first two letters
// ("camouflage" -> data/words/ca.json) so the app only downloads a little at a time.
// One-letter words ("a", "I") use the single letter.
export function bucketOf(word) {
  return word.toLowerCase().replace(/[^a-z]/g, '').slice(0, 2);
}
