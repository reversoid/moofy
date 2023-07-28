import { Button, styled } from '@nextui-org/react';
import { FC } from 'react';
import { SearchType } from '../SearchPage';

const Container = styled('div', {
  display: 'flex',
  ai: 'center',
  gap: '$8',
  mt: '$12',
});

const GroupButton = styled(Button, {
  minWidth: 'auto !important',
  border: '2px solid transparent',
});

export interface SearchTypeGroupProps {
  type?: SearchType;
  setType?: (type: SearchType) => void;
}

export const SearchTypeGroup: FC<SearchTypeGroupProps> = ({
  type,
  setType,
}) => {
  const handleSelectButton = (type: SearchType) => () => {
    setType?.(type);
  };

  return (
    <Container>
      <GroupButton
        onClick={handleSelectButton(SearchType.collections)}
        rounded
        bordered={type !== SearchType.collections}
      >
        Коллекции
      </GroupButton>
      <GroupButton
        onClick={handleSelectButton(SearchType.users)}
        rounded
        bordered={type !== SearchType.users}
      >
        Пользователи
      </GroupButton>
    </Container>
  );
};
