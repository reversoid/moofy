import GearButton from '@/shared/components/GearButton';
import Dropdown, { Option } from '@/shared/ui/Dropdown/Dropdown';
import { ButtonProps } from '@nextui-org/react';
import { FC, memo } from 'react';

export interface ListOwnerActionsProps {
  onClickUpdate: () => void;
  onClickDelete: () => void;
  buttonProps?: ButtonProps;
}

const ListOwnerActions: FC<ListOwnerActionsProps> = ({
  onClickDelete,
  onClickUpdate,
  buttonProps,
}) => {
  const dropdownOptions: Option[] = [
    {
      label: 'Изменить',
      key: 'update',
      callback: onClickUpdate,
    },
    {
      label: 'Удалить',
      key: 'delete',
      callback: onClickDelete,
      color: 'error',
    },
  ];

  return (
    <Dropdown
      trigger={<GearButton {...buttonProps} />}
      options={dropdownOptions}
      placement="left"
    />
  );
};

export default memo(ListOwnerActions);
