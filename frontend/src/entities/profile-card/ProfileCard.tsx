import { ProfileShort } from '@/shared/api/types/profile.type';
import profileIcon from '@/shared/assets/img/user-round.svg';
import { Icon } from '@/shared/ui/Icon/Icon';
import {
  CardWithContent,
  Img,
  ImgPlaceholder,
} from '@/shared/ui/card-with-content/CardWithContent';
import { styled } from '@nextui-org/react';
import { FC } from 'react';

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

export interface UserItemProps {
  profile: ProfileShort;
  button?: JSX.Element;
}

export const ProfileCard: FC<UserItemProps> = ({ profile, button }) => {
  return (
    <CardWithContent
      title={profile.username}
      description={profile.description ?? ''}
      link={`/profile/${profile.id}`}
      image={<Image url={profile.image_url} />}
      button={button}
    />
  );
};
