import { SearchInput } from '@/shared/components/SearchInput';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Text } from '@nextui-org/react';
import { Collections } from './ui/Collections';
import { Profiles } from './ui/Profiles';
import { SearchTypeGroup } from './ui/SearchTypeGroup';
import { SearchTarget, useSearchPage } from './utils/useSearchPage';

export const SearchPage = () => {
  const {
    collections,
    collectionsLoading,
    profiles,
    profilesLoading,
    searchCallback,
    searchTarget,
    setSearchTarget,
  } = useSearchPage();

  useLoadingBar(collectionsLoading, profilesLoading);

  return (
    <>
      <Text h1>Поиск</Text>
      <SearchInput onChange={searchCallback} />
      <SearchTypeGroup type={searchTarget} setType={setSearchTarget} />

      {searchTarget === SearchTarget.collections ? (
        <Collections loading={collectionsLoading} collections={collections} />
      ) : (
        <Profiles loading={profilesLoading} profiles={profiles} />
      )}
    </>
  );
};
