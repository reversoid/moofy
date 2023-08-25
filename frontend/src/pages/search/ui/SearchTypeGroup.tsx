import { styled } from '@nextui-org/react';
import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchTarget } from '../utils/SearchTarget.enum.';
import { SelectButton } from './SelectButton';

const Container = styled('div', {
  display: 'flex',
  ai: 'center',
  gap: '$8',
  mt: '$12',
});

export const SearchTypeGroup: FC = () => {
  const { pathname } = useLocation();
  const selectedSearchType = pathname.split('/').at(-1) as SearchTarget;

  return (
    <Container>
      <SelectButton
        isSelected={selectedSearchType === SearchTarget.collections}
        text="Коллекции"
        url="/search/collections"
      />
      <SelectButton
        isSelected={selectedSearchType === SearchTarget.profiles}
        text="Пользователи"
        url="/search/profiles"
      />
    </Container>
  );
};
