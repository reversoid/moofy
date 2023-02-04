import { useAuth } from '@/shared/hooks/useAuth';
import React, { PropsWithChildren, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthOnlyProps {
  redirect?: string;
  fallback?: ReactNode
}

/** Redirects to specific page or shows a fallback when user is not authorized*/
const AuthOnly = ({
  children,
  fallback,
  redirect,
}: PropsWithChildren<AuthOnlyProps>) => {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return null
  }

  if (isLoggedIn) {
    return <>{children}</>
  }

  if (redirect) {
    return <Navigate to={redirect=''}/>;
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return null;
};

export default AuthOnly;
