const SPECIAL_FULL_TEXT_SEARCH_SYMBOLS_PATTERN = /[&|!<():*]/g;

/** Make string ready to pass into **to_tsquery** function
 *
 *  Capabillities:
 *  1) Strict search with start of each word (*hell* will match with *hello*)
 *  2) All words must be in a document
 *
 */
export const getTsQueryFromString = (searchString: string) =>
  searchString
    .replace(SPECIAL_FULL_TEXT_SEARCH_SYMBOLS_PATTERN, '')
    .split(' ')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((word) => `${word}:*`)
    .join(' & ');
