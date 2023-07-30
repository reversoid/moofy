import { Card } from '@/shared/ui/Card';
import { Link } from '@/shared/ui/Link/Link';
import { CSS, Image, Text, styled } from '@nextui-org/react';
import React, { FC, ReactNode } from 'react';

const Content = styled('div', { flexGrow: 1 });

const ImgWrapper = styled('div', {
  display: 'flex',
  ai: 'center',
  jc: 'center',
});

export const IMAGE_SIZE = '7rem';
export const IMAGE_SIZE_LARGER = '8.75rem';
export const IMAGE_SIZE_SMALLER = '6rem';

export const IMG_STYLES = {
  width: `${IMAGE_SIZE} !important`,
  height: `${IMAGE_SIZE} !important`,

  '@xsMax': {
    mx: 'auto',
  },

  variants: {
    largerOnXs: {
      true: {
        '@xsMax': {
          width: `${IMAGE_SIZE_LARGER} !important`,
          height: `${IMAGE_SIZE_LARGER} !important`,
        },
      },
    },

    smallerOnXs: {
      true: {
        '@xsMax': {
          width: `${IMAGE_SIZE_SMALLER} !important`,
          height: `${IMAGE_SIZE_SMALLER} !important`,
        },
      },
    },
  },
};

export const Img = styled(Image, {
  margin: 0,
  ...IMG_STYLES,
  img: {
    objectFit: 'cover',
  },
  flexShrink: 0,
});

export const ImgPlaceholder = styled('div', {
  ...IMG_STYLES,
});

const MainContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

export interface SearchItemProps {
  title: string;
  link: string;
  image: ReactNode;
  description: string;
  bottomContent?: ReactNode;
}

export const SearchItem: FC<SearchItemProps> = ({
  image,
  link,
  title,
  description,
  bottomContent,
}) => {
  return (
    <Card horizontal>
      <ImgWrapper>
        <Link to={link}>{image}</Link>
      </ImgWrapper>
      <Content>
        <MainContent>
          <Link to={link} css={{ width: 'fit-content' }}>
            <Text
              h4
              color="$primary"
              css={{ lineHeight: '$sm', display: 'inline-block' }}
            >
              {title}
            </Text>
          </Link>

          {description && <Text as={'p'}>{description}</Text>}

          {bottomContent}
        </MainContent>
      </Content>
    </Card>
  );
};
