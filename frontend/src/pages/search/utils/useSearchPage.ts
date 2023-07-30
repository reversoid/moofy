import { useCollectionsSearch } from '@/features/search-collections';
import { useProfilesSearch } from '@/features/search-profiles';
import { useCallback, useState } from 'react';

export const enum SearchTarget {
  collections,
  users,
}

export const useSearchPage = () => {
  const collections = useCollectionsSearch();
  const profiles = useProfilesSearch();

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

  return {
    collectionsLoading: collections.loading,
    profilesLoading: profiles.loading,
    profiles: profiles.result,
    collections: collections.result,
    searchCallback: searchCallback(),
    searchTarget,
    setSearchTarget,
  };
};
