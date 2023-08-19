import { useCollectionsSearch } from '@/features/search-collections';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Collections } from '../Collections';
import { FC, useEffect } from 'react';
import { useStore } from 'effector-react';
import { $searchValue } from '../../model';

export const SearchCollections = () => {
  const { loading, result, setSearch } = useCollectionsSearch();
  const searchValue = useStore($searchValue);

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  useLoadingBar(loading);

  return <Collections loading={loading} collections={result} />;
};

export default SearchCollections;
