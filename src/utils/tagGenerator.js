export function generateTitleTags(text) {

  const lines =
    text
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

  return lines
    .slice(0, 5)
    .filter(
      line =>
        line.length > 3 &&
        line.length < 50
    );
}

export function generateKeywordTags(text) {

  const words =
    text
      .toLowerCase()
      .replace(
        /[^a-z0-9\s]/g,
        ""
      )
      .split(/\s+/);

  const stopWords = [
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "from",
    "are",
    "was",
    "you",
    "your",
    "have",
    "has",
    "will",
    "into",
    "during",
    "on",
    "of",
    "to",
    "in"
  ];

  return [
    ...new Set(
      words.filter(
        word =>
          word.length > 4 &&
          !stopWords.includes(word)
      )
    )
  ].slice(0, 20);
}