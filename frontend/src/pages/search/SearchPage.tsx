import { Text, styled } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { SearchInput } from '@/shared/components/SearchInput';
import { SearchTypeGroup } from './ui/SearchTypeGroup';
import { useCollectionsSearch } from '@/features/search-collections';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { SearchListItem } from './ui/SearchListItem';
import { useProfilesSearch } from '@/features/search-profiles';
import { SearchProfileItem } from './ui/SearchProfileItem';

export const enum SearchType {
  collections,
  users,
}

const Lists = styled('div', {
  display: 'flex',
  gap: '$8',
  flexDirection: 'column',
  mt: '$12',
});

export const SearchPage = () => {
  const {
    lists,
    loading: loadingLists,
    setSearch: setListsSearch,
  } = useCollectionsSearch();
  const {
    loading: loadingProfiles,
    profiles,
    setSearch: setProfileSearch,
  } = useProfilesSearch();

  useLoadingBar(loadingLists, loadingProfiles);

  const [searchType, setSearchType] = useState(SearchType.collections);

  const handleSearchListsChange = useCallback((search: string) => {
    setListsSearch(search);
  }, []);

  const handleSearchProfileChange = useCallback((search: string) => {
    setProfileSearch(search);
  }, []);

  const searchCallback = useCallback(() => {
    if (searchType === SearchType.collections) {
      return handleSearchListsChange;
    }

    if (searchType === SearchType.users) {
      return handleSearchProfileChange;
    }
  }, [searchType]);

  return (
    <>
      <Text h1>Поиск</Text>
      <SearchInput onChange={searchCallback()} />
      <SearchTypeGroup type={searchType} setType={setSearchType} />

      {searchType === SearchType.collections ? (
        <Lists>
          {lists?.map((list) => (
            <SearchListItem list={list} key={list.id} />
          ))}
        </Lists>
      ) : (
        <Lists>
          {profiles?.map((profile) => (
            <SearchProfileItem profile={profile} key={profile.id} />
          ))}
        </Lists>
      )}
    </>
  );
};
