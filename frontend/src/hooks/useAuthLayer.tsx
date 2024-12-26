import { useEffect, useCallback, useMemo } from 'react';
import { AuthUser } from '@types';
import { useAuth } from '@hooks';
import { useLocation } from 'react-router-dom';
import { QueryParams } from '@enums';

interface AuthContext {
  loading: boolean;
  auth: null | AuthUser;
  queries: string;
}

export const useAuthLayer = (): AuthContext => {
  const { loading, auth, setAuth } = useAuth();
  const { pathname, search } = useLocation();

  const queries = useMemo(() => {
    const params = new URLSearchParams(search).toString();
    const newParams = new URLSearchParams();

    if (pathname !== '/') {
      newParams.set(QueryParams.Redirect, pathname);
    }

    if (params !== '') {
      newParams.set(QueryParams.Params, params);
    }

    return newParams.toString();
  }, [search, pathname]);

  const getStatus = useCallback(async () => {
    // const token = localStorage.getItem(LocalStorageKey.Token);

    if (auth === null && loading) {
      setAuth('test', { name: 'test' });

      /*
      if (token) {
        try {
          const response = await getMe(token);
          setAuth(response.token, response.user);
        }
        catch (e) {
          console.error(e);
          revokeAuth();
        }
      }
      else {
        stopLoading();
      }
      */
    }
  }, [loading, auth, setAuth]);

  useEffect(() => {
    getStatus();
  }, [getStatus]);

  return {
    loading,
    auth,
    queries
  };
};
