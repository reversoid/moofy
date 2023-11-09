import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetchFilmInfo } from './use-fetch-film-info';

export const useFilmModal = () => {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filmId = searchParams.get('filmId');

  const { film } = useFetchFilmInfo(filmId);

  useEffect(() => {
    if (film) {
      setIsModalOpen(true);
    }
  }, [film]);

  return { isModalOpen, setIsModalOpen, film };
};
