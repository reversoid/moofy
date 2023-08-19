import { Icon } from '@/shared/ui/Icon/Icon';
import { Input } from '@nextui-org/react';
import searchIcon from '@/shared/assets/img/search.svg';
import React, { FC, useCallback } from 'react';
import debounce from 'lodash.debounce';

export interface SearchInputProps {
  /** Debounced onChange */
  onChange?: (value: string) => void;
  size?: 'xl' | 'xs' | 'sm' | 'md' | 'lg';
  value?: string;
  setValue?: (v: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({
  onChange,
  size,
  value,
  setValue,
}) => {
  const onChangeDebounced = useCallback(debounce((str: string) => onChange?.(str), 300), []);

  return (
    <Input
      value={value}
      size={size ?? 'xl'}
      placeholder="Поиск"
      fullWidth={true}
      contentLeft={<Icon iconUrl={searchIcon} size={'3rem'} />}
      onChange={(e) => {
        setValue?.(e.target.value);
        onChangeDebounced(e.target.value);
      }}
    />
  );
};
