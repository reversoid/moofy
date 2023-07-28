import { Text, styled } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { SearchInput } from '@/shared/components/SearchInput';
import { SearchTypeGroup } from './ui/SearchTypeGroup';
import { useCollectionsSearch } from '@/features/search-collections';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { SearchListItem } from './ui/SearchListItem';
import { useProfilesSearch } from '@/features/search-profiles';
import { SearchProfileItem } from './ui/SearchProfileItem';
import { Stack } from './ui/Stack';

export const enum SearchTarget {
  collections,
  users,
}

export const SearchPage = () => {
  const collections = useCollectionsSearch();
  const profiles = useProfilesSearch();

  useLoadingBar(collections.loading, profiles.loading);

  const [searchTarget, setSearchTarget] = useState(SearchTarget.collections);

  const handleSearchListsChange = useCallback((search: string) => {
    collections.setSearch(search);
  }, []);

  const handleSearchProfileChange = useCallback((search: string) => {
    profiles.setSearch(search);
  }, []);

  const searchCallback = useCallback(() => {
    if (searchTarget === SearchTarget.collections) {
      return handleSearchListsChange;
    }

    if (searchTarget === SearchTarget.users) {
      return handleSearchProfileChange;
    }
  }, [searchTarget]);

  return (
    <>
      <Text h1>Поиск</Text>
      <SearchInput onChange={searchCallback()} />
      <SearchTypeGroup type={searchTarget} setType={setSearchTarget} />

      {searchTarget === SearchTarget.collections ? (
        <Stack>
          {collections.result?.map((list) => (
            <SearchListItem list={list} key={list.id} />
          ))}
        </Stack>
      ) : (
        <Stack>
          {profiles.result?.map((profile) => (
            <SearchProfileItem profile={profile} key={profile.id} />
          ))}
        </Stack>
      )}
    </>
  );
};
