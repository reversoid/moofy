import { Text, styled } from '@nextui-org/react';
import React, { useCallback } from 'react';
import { SearchInput } from '@/shared/components/SearchInput';
import { SearchTypeGroup } from './ui/SearchTypeGroup';
import { useCollectionsSearch } from '@/features/search-collections';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { SearchListItem } from './ui/SearchListItem';

export const enum SearchType {
  collections,
  users,
}

const Lists = styled('div', {
  display: 'flex',
  gap: '$8',
  flexDirection: 'column',
  mt: '$12'
});

export const SearchPage = () => {
  const { lists, loading, setSearch } = useCollectionsSearch();

  useLoadingBar(loading);

  const handleSearchChange = useCallback((search: string) => {
    setSearch(search);
  }, []);

  return (
    <>
      <Text h1>Поиск</Text>
      <SearchInput onChange={handleSearchChange} />
      <SearchTypeGroup defaultType={SearchType.collections} />

      <Lists>
        {lists?.map((list) => (
          <SearchListItem list={list} key={list.id} />
        ))}
      </Lists>
    </>
  );
};
