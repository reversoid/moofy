import { List } from '@/entities/List';
import { FC, memo } from 'react';

export interface CreateListItemProps {
  onClick: () => void;
}

export const CreateListItem: FC<CreateListItemProps> = memo(({ onClick }) => {
  return <List text="Создать коллекцию" onClick={onClick} />;
});
