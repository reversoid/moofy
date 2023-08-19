import React, { useEffect } from 'react';
import { Profiles } from '../Profiles';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { useStore } from 'effector-react';
import { useProfilesSearch } from '@/features/search-profiles';
import { $searchValue } from '../../model';

export const SearchProfiles = () => {
  const { loading, result, setSearch } = useProfilesSearch();
  const searchValue = useStore($searchValue);

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  useLoadingBar(loading);

  return <Profiles loading={loading} profiles={result} />;
};

export default SearchProfiles;
