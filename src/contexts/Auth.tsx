import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { authService } from '@/features/auth/services/auth.service';
import { useMount } from '@/shared/hooks/useMount';

const AuthContext = createContext<{
  isLoggedIn: boolean | undefined;
  isLoading: boolean;
}>({
  isLoggedIn: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loggedIn, setLoggedIn] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  async function checkIfUserLoggedIn() {
    try {
      await authService.checkout();
      setLoggedIn(true);
    } catch (error) {
      setLoggedIn(false);
    }
    setLoading(false);
  }

  useMount(checkIfUserLoggedIn);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          isLoggedIn: loggedIn,
          isLoading: loading,
        }),
        [loggedIn, loading],
      )}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
