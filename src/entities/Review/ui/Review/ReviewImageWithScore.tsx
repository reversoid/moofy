import { getColorsByScore } from '@/shared/lib/scoreColors';
import { styled, Image } from '@nextui-org/react';
import { FC, memo, useMemo } from 'react';

const ImageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  '@xsMax': {
    justifyContent: 'center',
  },
  '& .nextui-image-container': {
    margin: '0 !important',
  },
});

const ImgWrapper = styled('div');

const Score = styled('div', {
  width: '1.5rem',
  textAlign: 'center',
  fontSize: '$sm',
  background: '$red100',
  lineHeight: 1.25,
});

const ReviewImageWithScore: FC<{
  imgSrc: string;
  score: number | null;
}> = ({ imgSrc, score }) => {
  const colors = useMemo(() => getColorsByScore(score), [score]);

  return (
    <ImageContainer>
      <ImgWrapper
        css={{
          position: 'relative',
        }}
      >
        <Image
          showSkeleton
          src={imgSrc}
          width={'6.75rem'}
          height={'10rem'}
          objectFit="cover"
          css={{
            flexShrink: 0,
            aspectRatio: '27 / 40',
          }}
        />
        {score && (
          <Score
            css={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: colors?.main ?? '',
              color: colors?.contrast ?? '',
            }}
          >
            {score}
          </Score>
        )}
      </ImgWrapper>
    </ImageContainer>
  );
};

export default memo(ReviewImageWithScore);
