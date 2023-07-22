/** Represents date as dd.mm.yyyy */
export const formatDate = (rawDate: string | Date) => {
  const date = new Date(rawDate);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
