import { getColorsByScore } from '@/shared/utils/scoreColors';
import { styled, Image } from '@nextui-org/react';
import { NONAME } from 'dns';
import { FC, memo } from 'react';

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
  const colors = getColorsByScore(score);

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
          objectFit="cover"
          css={{
            width: '6.75rem',
            height: '10rem',
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
              zIndex: 100000,
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
