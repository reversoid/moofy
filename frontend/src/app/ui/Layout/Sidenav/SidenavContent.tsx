import { Image, Text, styled } from '@nextui-org/react';
import profile from '@/shared/assets/img/user-round.svg';
import logoutIcon from '@/shared/assets/img/logout.svg';
import { Icon } from '@/shared/ui/Icon/Icon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/auth';
import { useLogout } from '@/features/auth';
import { FC } from 'react';
// TODO create @icon/ shortcut for paths

const List = styled('ul', {
  margin: 0,
  padding: '$sm',
  display: 'flex',
  flexDirection: 'column',
  gap: '$5'
});
const Li = styled('li', {
  backgroundColor: '$accents0',
  padding: '$sm',
  borderRadius: '$base',
  display: 'flex',
  ai: 'center',
  gap: '$8',
  margin: 0,
});

const StyledText = styled(Text, {
  fontSize: '$2xl',
  fontWeight: '$bold',
});

interface SidenavContentProps {
  onItemClick: () => void;
}

export const SidenavContent: FC<SidenavContentProps> = ({ onItemClick }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const logoutMutation = useLogout();

  return (
    <List>
      <Li
        onClick={() => {
          navigate(`/profile/${userId}`);
          onItemClick();
        }}
      >
        <Icon size={'3rem'} iconUrl={profile} />
        <StyledText>Профиль</StyledText>
      </Li>
      <Li
        onClick={() => {
          logoutMutation.mutate();
          onItemClick();
        }}
      >
        <Icon size={'3rem'} iconUrl={logoutIcon} />
        <StyledText color="$error">Выйти</StyledText>
      </Li>
    </List>
  );
};
