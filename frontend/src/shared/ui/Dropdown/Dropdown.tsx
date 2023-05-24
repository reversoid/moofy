import { Dropdown as _Dropdown, PopoverPlacement } from '@nextui-org/react';
import React, { memo } from 'react';

export interface Option {
  label: string;
  key: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  callback?: () => void;
}
export interface ActionsDropdownProps {
  trigger: JSX.Element;
  options: Option[];
  placement: PopoverPlacement;
  menuAriaLabel?: string;
}

const Dropdown = ({
  trigger,
  options,
  placement,
  menuAriaLabel,
}: ActionsDropdownProps) => {
  return (
    <_Dropdown placement={placement} isBordered>
      <_Dropdown.Trigger>{trigger}</_Dropdown.Trigger>

      <_Dropdown.Menu
        aria-label={menuAriaLabel ?? 'Dropdown Actions'}
        onAction={(key) => {
          const optionCallback = options.find(
            (option) => option.key === key,
          )?.callback;
          optionCallback && optionCallback();
        }}
      >
        {options.map((option) => (
          <_Dropdown.Item key={option.key} color={option.color}>
            {option.label}
          </_Dropdown.Item>
        ))}
      </_Dropdown.Menu>
    </_Dropdown>
  );
};

export default memo(Dropdown);
