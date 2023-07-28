import { Button, Image, Text, styled } from '@nextui-org/react';
import profile from '@/shared/assets/img/user-round.svg';
import search from '@/shared/assets/img/search.svg';
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
  gap: '$5',
});
const Li = styled('li', {
  margin: 0,
});

const StyledText = styled(Text, {
  fontSize: '$2xl',
  fontWeight: '$bold',
});

const LiButton = styled(Button, {
  background: 'none !important',
  width: '100% !important',
  height: '100% !important',
  maxWidth: 'none !important',
  padding: '$sm !important',
  borderRadius: '$base !important',
  display: 'flex !important',
  ai: 'center !important',
  jc: 'flex-start',
  backgroundColor: '$accents0 !important',
  minWidth: 'auto !important',
  '& .nextui-button-text': {
    gap: '$8 !important',
  },
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
      <Li>
        <LiButton
          onClick={() => {
            navigate(`/profile/${userId}`);
            onItemClick();
          }}
        >
          <Icon size={'3rem'} iconUrl={profile} />
          <StyledText>Профиль</StyledText>
        </LiButton>
      </Li>

      <Li>
        <LiButton
          onClick={() => {
            navigate(`/search`);
            onItemClick();
          }}
        >
          <Icon size={'3rem'} iconUrl={search} />
          <StyledText>Поиск</StyledText>
        </LiButton>
      </Li>

      <Li>
        <LiButton
          onClick={() => {
            logoutMutation.mutate();
            onItemClick();
          }}
        >
          <Icon size={'3rem'} iconUrl={logoutIcon} />
          <StyledText color="$error">Выйти</StyledText>
        </LiButton>
      </Li>
    </List>
  );
};
