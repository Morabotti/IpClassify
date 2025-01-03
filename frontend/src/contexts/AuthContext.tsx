import { useState, createContext, ReactNode } from 'react';
import { LocalStorageKey } from '@enums';
import { AuthUser } from '@types';
import { clearAuthToken, setAuthToken } from '@client';

interface AuthContext {
  loading: boolean;
  auth: null | AuthUser;
  token: null | string;
  setAuth: (token: string, user: AuthUser) => void;
  revokeAuth: () => void;
  stopLoading: () => void;
}

interface Props {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContext>({
  loading: true,
  auth: null,
  token: null,
  setAuth: () => {},
  revokeAuth: () => {},
  stopLoading: () => {}
});

export const AuthProvider = ({ children }: Props): ReactNode => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<null | string>(null);
  const [auth, setStateAuth] = useState<null | AuthUser>(null);

  const setAuth = (token: string, user: AuthUser) => {
    localStorage.setItem(LocalStorageKey.Token, token);
    setToken(token);
    setAuthToken(token);
    setStateAuth(user);
    setLoading(false);
  };

  const revokeAuth = () => {
    clearAuthToken();
    localStorage.removeItem(LocalStorageKey.Token);
    setStateAuth(null);
    setToken(null);
    setLoading(false);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        auth,
        token,
        setAuth,
        revokeAuth,
        stopLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
