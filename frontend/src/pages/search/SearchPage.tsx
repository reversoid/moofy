import { Text } from '@nextui-org/react';
import { SearchInput } from '@/shared/components/SearchInput';
import { SearchTypeGroup } from './ui/SearchTypeGroup';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { SearchListItem } from './ui/SearchListItem';
import { SearchProfileItem } from './ui/SearchProfileItem';
import { Stack } from './ui/Stack';
import { SearchTarget, useSearchPage } from './utils/useSearchPage';

export const SearchPage = () => {
  const {
    collections,
    collectionsLoading,
    profiles,
    profilesLoading,
    searchCallback,
    searchTarget,
    setSearchTarget
  } = useSearchPage();

  useLoadingBar(collectionsLoading, profilesLoading)

  return (
    <>
      <Text h1>Поиск</Text>
      <SearchInput onChange={searchCallback} />
      <SearchTypeGroup type={searchTarget} setType={setSearchTarget} />

      {searchTarget === SearchTarget.collections ? (
        <Stack>
          {collections?.map((list) => (
            <SearchListItem list={list} key={list.id} />
          ))}
        </Stack>
      ) : (
        <Stack>
          {profiles?.map((profile) => (
            <SearchProfileItem profile={profile} key={profile.id} />
          ))}
        </Stack>
      )}
    </>
  );
};
