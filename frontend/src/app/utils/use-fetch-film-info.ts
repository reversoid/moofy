import { useQuery } from '@tanstack/react-query';
import { getFilmById } from './app-film.service';

export const useFetchFilmInfo = (filmId: string | null) => {
  const result = useQuery({
    enabled: Boolean(filmId),
    queryKey: [filmId],
    queryFn: () => getFilmById(filmId!),
  });

  return {
    film: result.data?.film,
    isLoading: result.isLoading,
  };
};
