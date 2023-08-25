import { useSearchFilms } from '@/features/search-films/utils/useSearchFilms';
import { Input } from '@/shared/ui/Input/Input';
import useAutocomplete from '@mui/material/useAutocomplete';
import {
  Button,
  Image,
  InputProps,
  Loading,
  Row,
  Text,
  styled,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Li, LiBody, Listbox } from './Listbox';

const CreateReviewModal = React.lazy(
  () => import('@/features/review/create-review/ui/CreateReviewModal'),
);

export const ImageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  height: '100%',
  width: '2.86875rem',
});

export const Wrapper = styled('div', { width: '100%', position: 'relative' });

export const SearchFilmPage = () => {
  const { id } = useParams();
  const { films, isLoading, searchFilms } = useSearchFilms();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    inputValue,
    value: selectedFilm,
  } = useAutocomplete({
    getOptionLabel: (option) => option.name ?? '',
    filterOptions: (x) => x,
    options: films ?? [],
  });

  useEffect(() => {
    const isFilmJustSelected = selectedFilm?.name === inputValue;
    if (isFilmJustSelected) {
      return;
    }

    if (!inputValue.trim()) {
      return;
    }
    
    searchFilms(inputValue);
  }, [inputValue]);

  return (
    <>
      <Wrapper {...getRootProps()}>
        <Text h1>Найти фильм</Text>

        <Input
          {...(getInputProps() as unknown as InputProps)}
          fullWidth
          placeholder="Поиск фильма"
          size="xl"
          contentRight={isLoading ? <Loading size="sm" /> : <div></div>}
        />
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {films?.map((option, index) => (
              <Li {...{ ...getOptionProps({ option, index }), key: option.id }}>
                <ImageContainer>
                  <Image
                    showSkeleton
                    src={option.posterPreviewUrl}
                    height={'100%'}
                    objectFit="cover"
                    css={{
                      aspectRatio: '27 / 40',
                    }}
                  />
                </ImageContainer>
                <LiBody css={{ flexGrow: 1 }}>
                  <Text b color="inherit">
                    {option.name}
                  </Text>
                  <Text as={'p'} css={{ lineHeight: 1, color: 'inherit' }}>
                    {option.year}
                  </Text>
                </LiBody>
              </Li>
            ))}
          </Listbox>
        ) : null}
        <Row justify="flex-end" css={{ mt: '$10' }}>
          <Button
            size="lg"
            disabled={!selectedFilm}
            css={{
              width: 'fit-content',
              minWidth: 0,
              '@xsMax': {
                width: '100%',
              },
            }}
            onClick={() => setIsModalOpen(true)}
          >
            Далее
          </Button>
        </Row>
      </Wrapper>

      <CreateReviewModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        film={selectedFilm!}
        listId={Number(id)}
      />
    </>
  );
};

export default SearchFilmPage;
