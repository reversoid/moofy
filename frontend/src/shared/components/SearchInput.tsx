import { Icon } from '@/shared/ui/Icon/Icon';
import { Input } from '@nextui-org/react';
import searchIcon from '@/shared/assets/img/search.svg';
import React, { FC } from 'react';
import debounce from 'lodash.debounce';

export interface SearchInputProps {
  /** Debounced onChange */
  onChange?: (value: string) => void;
  size?: 'xl' | 'xs' | 'sm' | 'md' | 'lg';
}

export const SearchInput: FC<SearchInputProps> = ({ onChange, size }) => {
  const onChangeDebounced = debounce((str: string) => onChange?.(str), 300);

  return (
    <Input
      size={size ?? "xl"}
      placeholder="Поиск"
      fullWidth={true}
      contentLeft={<Icon iconUrl={searchIcon} size={'3rem'} />}
      onChange={(e) => onChangeDebounced(e.target.value)}
    />
  );
};
