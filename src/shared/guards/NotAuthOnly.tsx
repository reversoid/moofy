import { useAuth } from '@/shared/hooks/useAuth';
import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export interface NotAuthOnlyProps {
  redirectTo: string;
}

/** Redirects to specific page when user is authorized*/
const NotAuthOnly = ({
  redirectTo,
  children,
}: PropsWithChildren<NotAuthOnlyProps>) => {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading || isLoggedIn === undefined) {
    return null
  }

  if (!isLoggedIn) {
    return <>{children}</>
  }

  return <Navigate to={redirectTo}/>;
};

export default NotAuthOnly;
