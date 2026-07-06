const WORDS_PER_MINUTE = 200;

export function countWords(text) {
  if (!text) return 0;
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/\[(\d+)\]/g, ' ')
    .replace(/[#>*_\-\[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function estimateReadMinutes(text, wpm = WORDS_PER_MINUTE) {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / wpm));
}
