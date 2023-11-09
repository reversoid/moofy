import GearButton from '@/shared/components/GearButton';
import Dropdown, { Option } from '@/shared/ui/Dropdown/Dropdown';
import { ButtonProps } from '@nextui-org/react';
import { FC } from 'react';

export interface OwnerActionsProps {
  onClickUpdate: () => void;
  onClickDelete: () => void;
  onClickShare: () => void;
  buttonProps?: ButtonProps;
}

export const ReviewOwnerActions: FC<OwnerActionsProps> = ({
  onClickDelete,
  onClickUpdate,
  buttonProps,
  onClickShare,
}) => {
  const dropdownOptions: Option[] = [
    {
      key: 'share-film',
      callback: onClickShare,
      label: 'Поделиться фильмом',
    },
    {
      key: 'update',
      callback: onClickUpdate,
      label: 'Изменить',
    },
    {
      key: 'delete',
      callback: onClickDelete,
      label: 'Удалить',
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
