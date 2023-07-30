import {
  Img,
  ImgPlaceholder,
  SearchItem,
} from '@/entities/search-item/SearchItem';
import { ProfileShortWithDescription } from '@/shared/api/types/profile.type';
import profileIcon from '@/shared/assets/img/user-round.svg';
import { Icon } from '@/shared/ui/Icon/Icon';
import { styled } from '@nextui-org/react';
import { FC } from 'react';

export interface SearchProfileItemProps {
  profile: ProfileShortWithDescription;
}

const Background = styled(ImgPlaceholder, {
  backgroundColor: '$neutral',
  borderRadius: '50%',
  display: 'flex',
  ai: 'center',
  jc: 'center',
});

const ImgRounded = styled(Img, {
  borderRadius: '50%',
});

const Image: FC<{ url: string | null }> = ({ url }) => {
  if (url) {
    return <ImgRounded src={url} smallerOnXs />;
  }

  return (
    <Background smallerOnXs>
      <Icon size={'3.5rem'} iconUrl={profileIcon} />
    </Background>
  );
};

export const SearchProfileItem: FC<SearchProfileItemProps> = ({ profile }) => {
  return (
    <SearchItem
      title={profile.username}
      description={profile.description ?? ''}
      link={`/profile/${profile.id}`}
      image={<Image url={profile.image_url} />}
    />
  );
};
