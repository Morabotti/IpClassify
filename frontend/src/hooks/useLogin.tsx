import { LoginRequest } from '@types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { QueryParams } from '@enums';
import { authApi } from '@client';

interface LoginContract {
  error: boolean;
  loading: boolean;
  onSubmit: (login: LoginRequest) => void;
};

export const useLogin = (): LoginContract => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { setAuth, auth } = useAuth();
  const [state, setState] = useState({ loading: false, error: false });

  const onSubmit = async (data: LoginRequest) => {
    setState({ loading: true, error: false });

    try {
      const { token, user } = await authApi.authenticate(data);
      setState({ loading: false, error: false });
      setAuth(token, user);
    }
    catch (e) {
      setState({ loading: false, error: true });
    }
  };

  useEffect(() => {
    if (!auth) return;

    if (!search) {
      navigate('/');
      return;
    }

    const params = new URLSearchParams(search);
    const redirect = params.get(QueryParams.Redirect);
    const queries = params.get(QueryParams.Params);

    const path = redirect || '/';
    const queryParmas = queries
      ? `?${new URLSearchParams(queries).toString()}`
      : '';

    navigate(`${path}${queryParmas}`);
  }, [auth, navigate, search]);

  return {
    error: state.error,
    loading: state.loading,
    onSubmit
  };
};
