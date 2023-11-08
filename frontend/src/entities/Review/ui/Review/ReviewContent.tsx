import { styled, Text, Link } from '@nextui-org/react';
import { FC, memo } from 'react';

const FilmInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  flexGrow: 1,
});

interface ReviewContentProps {
  filmName: string;
  filmYear: number;
  description: string;
  filmId: string;
  horizontal?: boolean;
}

const ReviewContent: FC<ReviewContentProps> = ({
  description,
  filmName,
  filmYear,
  filmId,
  horizontal,
}) => {
  return (
    <FilmInfo css={{ textAlign: horizontal ? 'left' : 'center' }}>
      <Text h4 css={{ mb: '$1', lineHeight: '$sm' }}>
        <Link
          href={`https://kinopoisk.ru/film/${filmId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {filmName}
        </Link>
      </Text>
      <Text b color="$neutral" css={{ mb: '$4', lineHeight: 1 }}>
        {filmYear}
      </Text>
      {horizontal && (
        <Text
          as={'p'}
          css={{ flexShrink: 1, lineHeight: '$md', fontSize: '$md' }}
          dangerouslySetInnerHTML={{ __html: description }}
        ></Text>
      )}
    </FilmInfo>
  );
};

export default memo(ReviewContent);
