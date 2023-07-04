/** Get ready string to pass into **to_tsquery** function
 *
 *  Capabillities:
 *  1) Strict search with start of each word (hell will match with hello)
 *  2) All words must be in a document
 *
 */
export const getTsQueryFromString = (searchString: string) =>
  searchString
    .split(' ')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((word) => `${word}:*`)
    .join(' & ');
