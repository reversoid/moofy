import { useAuth } from '@/shared/hooks/useAuth';
import { FC } from 'react';
import { Navigate, useParams } from 'react-router-dom';

interface UserIdGuardProps {
  componentIfIdMatch: JSX.Element;
  componentIfIdNotMatch: JSX.Element;
  navigateToIfWrongId: string;
}

const UserIdGuard: FC<UserIdGuardProps> = ({
  componentIfIdMatch,
  componentIfIdNotMatch,
  navigateToIfWrongId,
}) => {
  const { id } = useParams();
  if (
    Number(id) < 1 ||
    Number.isNaN(Number(id)) ||
    !Number.isInteger(Number(id))
  ) {
    return <Navigate to={navigateToIfWrongId} />;
  }

  const { isLoading, isLoggedIn, userId } = useAuth();

  if (isLoading || isLoggedIn === undefined) {
    return null;
  }

  if (Number(id) === userId) {
    return componentIfIdMatch;
  } else {
    return componentIfIdNotMatch;
  }
};

export default UserIdGuard;
