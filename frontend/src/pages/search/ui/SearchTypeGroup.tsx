import { Button, styled } from '@nextui-org/react';
import { FC } from 'react';
import { SearchTarget } from '../SearchPage';

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
  type?: SearchTarget;
  setType?: (type: SearchTarget) => void;
}

export const SearchTypeGroup: FC<SearchTypeGroupProps> = ({
  type,
  setType,
}) => {
  const handleSelectButton = (type: SearchTarget) => () => {
    setType?.(type);
  };

  return (
    <Container>
      <GroupButton
        onClick={handleSelectButton(SearchTarget.collections)}
        rounded
        bordered={type !== SearchTarget.collections}
      >
        Коллекции
      </GroupButton>
      <GroupButton
        onClick={handleSelectButton(SearchTarget.users)}
        rounded
        bordered={type !== SearchTarget.users}
      >
        Пользователи
      </GroupButton>
    </Container>
  );
};
