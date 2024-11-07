const SPECIAL_FULL_TEXT_SEARCH_SYMBOLS_PATTERN = /[&|!<():*]/g;

// TODO share
export const getTsQueryFromString = (searchString: string) =>
  searchString
    .replace(SPECIAL_FULL_TEXT_SEARCH_SYMBOLS_PATTERN, "")
    .split(" ")
    .map((c) => c.trim())
    .filter(Boolean)
    .map((word) => `${word}:*`)
    .join(" & ");
