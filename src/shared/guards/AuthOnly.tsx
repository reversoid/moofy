import { useAuth } from '@/shared/hooks/useAuth';
import React, { PropsWithChildren, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthOnlyProps {
  redirect?: string;
  fallback?: JSX.Element;
}

/** Redirects to specific page or shows a fallback when user is not authorized*/
const AuthOnly = ({
  children,
  fallback,
  redirect,
}: PropsWithChildren<AuthOnlyProps>) => {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading || isLoggedIn === undefined) {
    return null;
  }

  if (!isLoggedIn && redirect) {
    return <Navigate to={redirect} />;
  }

  if (!isLoggedIn && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthOnly;
