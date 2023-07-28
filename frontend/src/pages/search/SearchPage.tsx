import { Text } from '@nextui-org/react';
import React, { useCallback } from 'react';
import { SearchInput } from '@/shared/components/SearchInput';
import { SearchTypeGroup } from './ui/SearchTypeGroup';
import { useCollectionsSearch } from '@/features/search-collections';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';

export const enum SearchType {
  collections,
  users,
}

export const SearchPage = () => {
  const { isSearchFinished, lists, loading, setSearch } =
    useCollectionsSearch();

  useLoadingBar(loading);

  const handleSearchChange = useCallback((search: string) => {
    setSearch(search);
  }, []);

  return (
    <>
      <Text h1>Поиск</Text>
      <SearchInput onChange={handleSearchChange} />
      <SearchTypeGroup defaultType={SearchType.collections} />

      {lists?.map((l) => (
        <>{l.name} | </>
      ))}
    </>
  );
};
