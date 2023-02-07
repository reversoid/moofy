import React from 'react';
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled';
import { styled, Input, Image, Text } from '@nextui-org/react';

const InputStyled = styled(Input, {
  '& label': {
    color: 'white !important',
  },
});

const Listbox = styled('ul', {
  width: 'calc(100% - 3rem)',
  margin: 0,
  padding: 0,
  zIndex: 1,
  position: 'absolute',
  left: '1.5rem',
  listStyle: 'none',
  backgroundColor: '$blue900',
  overflow: 'auto',
  maxHeight: '15rem',
  color: '$black',
  '& li.Mui-focused': {
    backgroundColor: '$primary',
    cursor: 'pointer',
    color: '$blue900',
  },
  '& li:active': {
    backgroundColor: '$primary',
    color: '$blue900',
  },
  borderRadius: '1rem !important',
  scrollbarWidth: 0,
  overflowY: 'scroll',
  '-ms-overflow-style': 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  paddingBottom: 0,
});

const Wrapper = styled('div', {
  width: '100%',
  '& label': {
    color: '$text',
  },
});

const Li = styled('li', {
  height: '4.5rem',
  padding: '0rem',
  margin: 0,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '0.5rem',
});

const LiBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%'
});

interface Option {
  name: string;
  year: number;
  imgSrc: string;
}

const options: Option[] = [
  {
    imgSrc:
      'https://images.ctfassets.net/hrltx12pl8hq/3j5RylRv1ZdswxcBaMi0y7/b84fa97296bd2350db6ea194c0dce7db/Music_Icon.jpg',
    name: 'Шрек 555',
    year: 2022,
  },
];

const ImageContainer = styled('div', {
    display: 'flex',
    justifyContent: 'flex-start'
})

const Autocomplete = () => {
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    options: options,
    getOptionLabel: (option) => option.name,
  });

  return (
    <Wrapper>
      <div {...getRootProps()}>
        <InputStyled
          label="Фильм"
          size="xl"
          status="primary"
          {...getInputProps()}
          css={{
            '& label': { color: 'white !important' },
            '& input': {
              color: '$text',
            },
          }}
          width="100%"
          placeholder="Введите имя фильма"
        />
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {(groupedOptions as typeof options).map((option, index) => (
            <Li {...getOptionProps({ option, index })}>
              <ImageContainer>
                <Image
                  showSkeleton
                  src={option.imgSrc}
                  width={'3.0375rem'}
                  objectFit="cover"
                  css={{
                    flexShrink: 0,
                    aspectRatio: '27 / 40',
                  }}
                />
              </ImageContainer>
              <LiBody css={{ flexGrow: 1 }}>
                <Text b color='inherit'>Шрек 555</Text>
                <Text as={'p'} css={{lineHeight: 1, color: 'inherit' }}>2022</Text>
              </LiBody>
            </Li>
          ))}
        </Listbox>
      ) : null}
    </Wrapper>
  );
};

export default Autocomplete;
