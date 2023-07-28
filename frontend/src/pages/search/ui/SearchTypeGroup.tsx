import { Button, styled } from '@nextui-org/react';
import React, { FC, useState } from 'react';
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
  defaultType?: SearchType;
  onSelectedType?: (type: SearchType) => void;
}

export const SearchTypeGroup: FC<SearchTypeGroupProps> = ({
  onSelectedType,
  defaultType,
}) => {
  const [selectedType, setSelectedType] = useState(defaultType);

  const handleSelectButton = (type: SearchType) => () => {
    onSelectedType?.(type)
    setSelectedType(type);
  };

  return (
    <Container>
      <GroupButton
        onClick={handleSelectButton(SearchType.collections)}
        rounded
        bordered={selectedType !== SearchType.collections}
      >
        Коллекции
      </GroupButton>
      <GroupButton
        onClick={handleSelectButton(SearchType.users)}
        rounded
        bordered={selectedType !== SearchType.users}
      >
        Пользователи
      </GroupButton>
    </Container>
  );
};
