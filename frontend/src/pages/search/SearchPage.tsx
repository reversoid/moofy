import { SearchInput } from '@/shared/components/SearchInput';
import { Text } from '@nextui-org/react';
import { Outlet, useLocation } from 'react-router-dom';
import { setSearchValue } from './model';
import { SearchTypeGroup } from './ui/SearchTypeGroup';
import { Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const SearchPage = () => {
  const { pathname } = useLocation();

  const { register, reset } = useForm<{ search: string }>();

  const clearSearchValues = () => {
    setSearchValue({ newValue: '' });
    reset();
  };

  useEffect(() => {
    clearSearchValues();
  }, [pathname]);

  return (
    <>
      <Text h1>Поиск</Text>
      <SearchInput
        {...register('search')}
        debouncedOnChange={(v) => setSearchValue({ newValue: v })}
      />
      <SearchTypeGroup />
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
};
