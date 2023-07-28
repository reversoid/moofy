import { ProfileShortWithDescription } from '@/shared/api/types/profile.type';
import { Card } from '@/shared/ui/Card';
import { Link } from '@/shared/ui/Link/Link';
import { Image, Text, styled } from '@nextui-org/react';
import { FC } from 'react';
import profileIcon from '@/shared/assets/img/user-round.svg'
import { Icon } from '@/shared/ui/Icon/Icon';

export interface SearchProfileItemProps {
  profile: ProfileShortWithDescription;
}

// TODO share with search list item

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
  borderRadius: '50%',
});

const MainContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const Background = styled('div', {
  width: '7rem',
  height: '7rem',
  backgroundColor: '$neutral',
  borderRadius: '50%',
  display: 'flex',
  ai: 'center',
  jc: 'center',
});

export const SearchProfileItem: FC<SearchProfileItemProps> = ({ profile }) => {
  return (
    <Card horizontal>
      <ImgWrapper>
        <Link to={`/profile/${profile.id}`}>
          {profile.image_url ? (
            <Img width={'7rem'} height={'7rem'} src={profile.image_url ?? ''} />
          ) : (
            <Background>
              <Icon
                size={'3.5rem'}
                iconUrl={profileIcon}
              />
            </Background>
          )}
        </Link>
      </ImgWrapper>
      <Content>
        <MainContent>
          <Link to={`/profile/${profile.id}`}>
            <Text h4 color="$primary" css={{ lineHeight: '$sm' }}>
              {profile.username}
            </Text>
          </Link>

          <Text as={'p'}>{profile.description}</Text>
        </MainContent>
      </Content>
    </Card>
  );
};
