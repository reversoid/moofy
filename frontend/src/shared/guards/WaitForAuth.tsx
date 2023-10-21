import { useAuth } from '@/app';
import React, { FC, PropsWithChildren } from 'react';

/** Does not render content until auth request is finished */
const WaitForAuth: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === undefined) {
    return null;
  }

  return <>{children}</>;
};

export default WaitForAuth;
