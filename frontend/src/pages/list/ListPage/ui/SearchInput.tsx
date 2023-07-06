import { Icon } from '@/shared/ui/Icon/Icon';
import { Input } from '@nextui-org/react';
import searchIcon from '@/shared/assets/img/search.svg';
import React, { FC, useCallback } from 'react';
import debounce from 'lodash.debounce';

export interface SearchInputProps {
  /** Debounced onChange */
  onChange: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ onChange }) => {
  const onChangeDebounced = debounce((str: string) => onChange(str), 300);

  return (
    <Input
      size="lg"
      placeholder="Поиск"
      css={{ width: '100%' }}
      contentLeft={<Icon iconUrl={searchIcon} size={'3rem'} />}
      onChange={(e) => onChangeDebounced(e.target.value)}
    />
  );
};
