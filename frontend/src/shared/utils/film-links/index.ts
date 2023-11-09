export const generateFilmLink = (filmId: string) => {
  return `${window.location.origin}?filmId=${filmId}`;
};
