import { List } from '@/shared/api/types/list.type';
import { Card } from '@/shared/ui/Card';
import { Link } from '@/shared/ui/Link/Link';
import { Image, Text, styled } from '@nextui-org/react';
import React, { FC } from 'react';

export interface SearchListItemProps {
  list: List;
}

const Content = styled('div', { flexGrow: 1 });

const ImgWrapper = styled('div', {
  display: 'flex',
  ai: 'center',
  jc: 'center',
});

const Img = styled(Image, {
  margin: 0,
  img: {
    objectFit: 'cover',
  },
  flexShrink: 0,
});

const MainContent = styled('div', {
  display: 'flex',
  jc: 'space-between',
  flexDirection: 'column',
  height: '100%',
});

export const SearchListItem: FC<SearchListItemProps> = ({ list }) => {
  return (
    <Card horizontal>
      <ImgWrapper>
        <Link to={`/list/${list.id}`}>
          <Img width={'7rem'} height={'7rem'} src={list.image_url ?? ''} />
        </Link>
      </ImgWrapper>
      <Content>
        <MainContent>
          <div>
            <Link to={`/list/${list.id}`}>
              <Text h4 color="$primary" css={{ lineHeight: '$sm' }}>
                {list.name}
              </Text>
            </Link>

            <Text as={'p'}>{list.description}</Text>
          </div>
          <Text as={'p'} css={{ mt: '$2', color: '$textLight' }}>
            Создатель{' '}
            <Link
              css={{ fontWeight: '$medium', display: 'inline' }}
              to={`/profile/${1}`}
            >
              {list.user?.username ?? 'username...'}
            </Link>
          </Text>
        </MainContent>
      </Content>
    </Card>
  );
};
