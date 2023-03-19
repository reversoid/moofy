import {
  Text,
  Image,
  styled,
  Row,
  Button,
  Loading,
  Input,
  InputProps,
} from '@nextui-org/react';
import useAutocomplete from '@mui/material/useAutocomplete';
import { useStore } from 'effector-react';
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Film } from '@/shared/api/types/film.type';
import { $getFilmsState, getFilmsByName } from '@/features/search-films';
import { Li, LiBody, Listbox } from './Listbox';
import { useParams } from 'react-router-dom';
import React from 'react';

const CreateReviewModal = React.lazy(() => import('@/features/review/create-review/ui/CreateReviewModal'))

export const ImageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  height: '100%',
  width: '2.86875rem',
});

export const Wrapper = styled('div', { width: '100%', position: 'relative' });

export const SearchFilmPage = () => {
  const [options, setOptions] = useState<Film[]>([]);

  const { id } = useParams();

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
    options,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { result, loading } = useStore($getFilmsState);

  const searchFilms = useMemo(() => debounce(getFilmsByName, 250), []);

  useEffect(() => {
    if (!inputValue) return;
    searchFilms(inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (!result) return;

    if (result.length > 0) {
      setOptions(result);
    }
  }, [result]);

  return (
    <>
      <Wrapper {...getRootProps()}>
        <Text h1>Найти фильм</Text>

        <Input
          {...(getInputProps() as unknown as InputProps)}
          fullWidth
          placeholder="Поиск фильма"
          size="xl"
          contentRight={loading ? <Loading size="sm" /> : <div></div>}
        />
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {options.map((option, index) => (
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
