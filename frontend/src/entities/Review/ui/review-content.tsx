import { styled, Text, Link } from '@nextui-org/react';
import { FC, memo } from 'react';
import { FilmNameWithYear } from './film-name-with-year';

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  flexGrow: 1,
});

const Description = styled(Text, {
  mt: '$4',
  flexShrink: 1,
  lineHeight: '$md',
  fontSize: '$md',
  wordBreak: 'break-word',
});

interface ReviewContentProps {
  filmName: string;
  filmYear: number;
  description: string;
  filmId: string;
}

const ReviewContent: FC<ReviewContentProps> = ({
  description,
  filmName,
  filmYear,
  filmId,
}) => {
  return (
    <Wrapper>
      <FilmNameWithYear name={filmName} year={filmYear} id={filmId} />
      <Description as={'p'} dangerouslySetInnerHTML={{ __html: description }} />
    </Wrapper>
  );
};

export default memo(ReviewContent);
