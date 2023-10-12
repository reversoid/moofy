import { Icon } from '@/shared/ui/Icon/Icon';
import { Input, InputProps } from '@nextui-org/react';
import searchIcon from '@/shared/assets/img/search.svg';
import React, { FC, forwardRef, useCallback } from 'react';
import debounce from 'lodash.debounce';

export interface SearchInputProps extends Partial<InputProps> {
  /** Debounced onChange */
  debouncedOnChange?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => {
    const onChangeDebounced = useCallback(
      debounce((str: string) => props.debouncedOnChange?.(str), 300),
      [],
    );

    return (
      <Input
        placeholder="Поиск"
        fullWidth={true}
        contentLeft={<Icon iconUrl={searchIcon} size={'3rem'} />}
        size={props.size ?? 'xl'}
        {...props}
        ref={ref}
        onChange={(e) => {
          props.onChange?.(e);
          onChangeDebounced(e.target.value);
        }}
      />
    );
  },
);
