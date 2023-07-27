import { Icon } from '@/shared/ui/Icon/Icon';
import { Input, Loading } from '@nextui-org/react';
import searchIcon from '@/shared/assets/img/search.svg';
import React, { FC, useCallback } from 'react';
import debounce from 'lodash.debounce';

export interface SearchInputProps {
  /** Debounced onChange */
  onChange: (value: string) => void;

  loading: boolean;
}

export const SearchInput: FC<SearchInputProps> = ({ onChange, loading }) => {
  const onChangeDebounced = debounce((str: string) => onChange(str), 300);

  return (
    <Input
      size="xl"
      placeholder="Поиск"
      fullWidth={true}
      contentLeft={<Icon iconUrl={searchIcon} size={'3rem'} />}
      onChange={(e) => onChangeDebounced(e.target.value)}
      contentRight={loading ? <Loading size="sm" /> : <></>}
    />
  );
};
