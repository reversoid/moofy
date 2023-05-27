import { useAuth } from '@/shared/hooks/useAuth';
import { PropsWithChildren } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

// TODO abstract actions with query params
export interface NotAuthOnlyProps {
  redirectTo: string;
  /** Specified query keys will be used */
  useQuery?: { [key: string]: boolean };
}

/** Redirects to specific page when user is authorized*/
const NotAuthOnly = ({
  redirectTo,
  children,
  useQuery
}: PropsWithChildren<NotAuthOnlyProps>) => {
  const { isLoading, isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams()

  if (isLoading || isLoggedIn === undefined) {
    return null;
  }

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  if (Object.keys(useQuery ?? {}).some(Boolean))  {
    // TODO abstract this logic 
    const fromUrl = searchParams.get('from')
    
    if (fromUrl) {
      return <Navigate to={fromUrl} />;
    }
  }

  return <Navigate to={redirectTo} />;
};

export default NotAuthOnly;
