import { Film, FilmType } from '@/features/list/services/list.service';
import { $lists } from '@/models/lists';
import { $list, $listState, getList } from '@/models/lists/singleList';
import { Input } from '@/shared/ui/Input';
import { Text, Image, styled, Row, Button } from '@nextui-org/react';
import useAutocomplete from '@mui/material/useAutocomplete';
import { useEvent, useStore } from 'effector-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

const Listbox = styled('ul', {
  width: '100%',
  margin: 0,
  padding: 0,
  zIndex: 201,
  position: 'absolute',
  left: '0rem',
  listStyle: 'none',
  backgroundColor: '$gray50',
  overflow: 'auto',
  maxHeight: '15rem',
  color: '$gray900',
  '& li.Mui-focused': {
    cursor: 'pointer',
    backgroundColor: '$gray100',
  },
  '& li:active': {
    backgroundColor: '$gray100',
  },
  borderRadius: '1rem !important',
  scrollbarWidth: 0,
  overflowY: 'scroll',
  '-ms-overflow-style': 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const Li = styled('li', {
  height: '5rem',
  padding: '$3 $5',
  margin: 0,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '$5',
  background: '$gray50',
});

const LiBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%',
});

const Wrapper = styled('div', { width: '100%', position: 'relative' });

interface PageContentProps {
  listId: number;
}

const PageContent = ({ listId }: PageContentProps) => {
  const [options, setOptions] = useState<Film[]>([
    {
      filmLength: '10:99',
      genres: ['HORROR'],
      id: '1',
      name: 'Побег из шоушенка',
      posterPreviewUrl:
        'http://kinohod.ru/o/f2/21/f2216441-4843-4e4d-a9e1-e3dc9bb63178.jpg',
      posterUrl: '',
      type: FilmType.FILM,
      year: 2022,
    },
    {
      filmLength: '10:99',
      genres: ['HORROR'],
      id: '6',
      name: 'Побег из шоушенка 2',
      posterPreviewUrl:
        'http://kinohod.ru/o/f2/21/f2216441-4843-4e4d-a9e1-e3dc9bb63178.jpg',
      posterUrl: '',
      type: FilmType.FILM,
      year: 2023,
    },
  ]);
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    options: options,
    getOptionLabel: (option) => option.name ?? '',
  });

  return (
    <>
      <Wrapper {...getRootProps()}>
        <Text h1>Найти фильм</Text>

        <Input
          {...getInputProps()}
          fullWidth
          placeholder="Поиск фильма"
          size="lg"
        />
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {(groupedOptions as typeof options).map((option, index) => (
              <Li {...getOptionProps({ option, index })}>
                <Image
                  showSkeleton
                  src={option.posterPreviewUrl}
                  height={'100%'}
                  objectFit="cover"
                  css={{
                    aspectRatio: '27 / 40',
                  }}
                />
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
          <Button css={{ width: 'fit-content', minWidth: 0 }}>Далее</Button>
        </Row>
      </Wrapper>
    </>
  );
};

const AddReviewPage = () => {
  const { id } = useParams();
  const getListWithContent = useEvent(getList);

  useEffect(() => {
    getListWithContent(Number(id));
  }, []);

  const lists = useStore($lists);
  const listWithContent = useStore($list);

  const { error, list, loading } = useStore($listState);

  const listAlreadyLoaded = useMemo(
    () => lists.items.find((list) => list.id === Number(id)),
    [],
  );

  if (list || listAlreadyLoaded) {
    return (
      <PageContent
        listId={listAlreadyLoaded?.id || (list?.list.id as number)}
      />
    );
  }

  return null;
};

export default memo(AddReviewPage);
