import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { filmService } from '../api/film.service';
import debounce from 'lodash.debounce';

export const useSearchFilms = () => {
  const [filmName, setFilmName] = useState('');

  const debouncedSearchFilm = useCallback(debounce(setFilmName, 250), []);

  const result = useQuery({
    queryKey: ['Search films', filmName],
    enabled: false,
    queryFn: ({ queryKey }) =>
      filmService.getFilmsByName(queryKey.at(-1) ?? ''),
  });

  useEffect(() => {
    if (!filmName) {
      return;
    }
    result.refetch();
  }, [filmName]);

  return {
    films: result.data?.items,
    isLoading: result.isRefetching,
    /** Debounced search films */
    searchFilms: (name: string) => debouncedSearchFilm(name),
  };
};
