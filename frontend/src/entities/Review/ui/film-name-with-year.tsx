import { CSS, Link, Text, styled } from '@nextui-org/react';
import { FC } from 'react';

const Wrapper = styled('div', {
  display: 'flex',
  gap: '$1',
  flexDirection: 'column',
});

export interface FilmNameWithYearProps {
  name: string;
  year: number;
  id: string;
  centered?: boolean;
}

export const FilmNameWithYear: FC<FilmNameWithYearProps> = ({
  id,
  name,
  year,
  centered,
}) => {
  const textAlign: CSS['textAlign'] = centered ? 'center' : 'start';

  return (
    <Wrapper>
      <Text h4 css={{ lineHeight: '$sm', textAlign, mb: '$1' }}>
        <Link
          href={`https://kinopoisk.ru/film/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </Link>
      </Text>
      <Text b color="$neutral" css={{ lineHeight: 1, textAlign }}>
        {year}
      </Text>
    </Wrapper>
  );
};
