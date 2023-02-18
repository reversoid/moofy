import { Dropdown, PopoverPlacement } from '@nextui-org/react';
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

const ActionsDropdown = ({
  trigger,
  options,
  placement,
  menuAriaLabel
}: ActionsDropdownProps) => {
  return (
    <Dropdown placement={placement} isBordered>
      <Dropdown.Trigger>{trigger}</Dropdown.Trigger>

      <Dropdown.Menu aria-label={ menuAriaLabel ?? "Dropdown Actions"} onAction={key => {
        const optionCallback = options.find(option => option.key === key)?.callback;
        optionCallback && optionCallback()
      }}>
        {options.map(option => (<Dropdown.Item key={option.key} color={option.color}>{option.label}</Dropdown.Item>))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default memo(ActionsDropdown);
