import { getColorsByScore } from '@/shared/utils/scoreColors';
import { styled, Image } from '@nextui-org/react';
import { FC, memo } from 'react';

const ImageContainer = styled('div', {
  display: 'flex',
  '@xsMax': {
    justifyContent: 'center',
  },
  '& .nextui-image-container': {
    margin: '0 !important',
  },
});

const ImgWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
});

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
  centered?: boolean;
}> = ({ imgSrc, score, centered }) => {
  const colors = getColorsByScore(score);

  return (
    <ImageContainer css={{ jc: centered ? 'center' : undefined }}>
      <ImgWrapper
        css={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          justifyContent: 'center',
        }}
      >
        <Image
          showSkeleton
          src={imgSrc}
          objectFit="cover"
          width={'6.75rem'}
          height={'10rem'}
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
