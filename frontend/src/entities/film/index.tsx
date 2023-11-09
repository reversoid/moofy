import { Film } from '@/shared/api/types/film.type';
import { Image, Link, Text, styled } from '@nextui-org/react';
import { FC } from 'react';

const ImageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  '@xsMax': {
    justifyContent: 'center',
  },
  '& .nextui-image-container': {
    margin: '0 !important',
  },
});

const Wrapper = styled('div');

const ImgWrapper = styled('div');

interface FilmItemProps {
  film: Film;
}

export const FilmItem: FC<FilmItemProps> = ({ film }) => {
  return (
    <Wrapper>
      <ImageContainer>
        <ImgWrapper
          css={{
            position: 'relative',
          }}
        >
          <Image
            showSkeleton
            src={film.posterPreviewUrl}
            width={'6.75rem'}
            height={'10rem'}
            objectFit="cover"
            css={{
              flexShrink: 0,
              aspectRatio: '27 / 40',
            }}
          />
        </ImgWrapper>
      </ImageContainer>

      <Text h4 css={{ mb: '$1', lineHeight: '$sm', ta: 'center', mt: '$5' }}>
        <Link
          href={`https://kinopoisk.ru/film/${film.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {film.name}
        </Link>
      </Text>
      <Text
        b
        color="$neutral"
        css={{
          width: '100%',
          lineHeight: 1,
          ta: 'center',
          display: 'block',
          mt: '$3',
        }}
      >
        {film.year}
      </Text>
    </Wrapper>
  );
};
