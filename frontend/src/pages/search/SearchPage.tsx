import { SearchInput } from '@/shared/components/SearchInput';
import { Text } from '@nextui-org/react';
import { Outlet, useLocation } from 'react-router-dom';
import { setSearchValue } from './model';
import { SearchTypeGroup } from './ui/SearchTypeGroup';
import { useEffect, useState } from 'react';

export const SearchPage = () => {
  const { pathname } = useLocation();
  const [value, setValue] = useState('');

  const clearSearchValues = () => {
    setSearchValue({ newValue: '' });
    setValue('');
  };

  useEffect(() => {
    clearSearchValues()
  }, [pathname]);

  return (
    <>
      <Text h1>Поиск</Text>
      <SearchInput
        value={value}
        setValue={setValue}
        onChange={(v) => setSearchValue({ newValue: v })}
      />
      <SearchTypeGroup />
      <Outlet />
    </>
  );
};
