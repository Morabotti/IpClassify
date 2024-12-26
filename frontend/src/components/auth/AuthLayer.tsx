import { Navigate } from 'react-router-dom';
import { PrimaryLoader, Text } from '@components/common';
import { ReactNode } from 'react';
import { useAuthLayer } from '@hooks';

interface Props {
  children: ReactNode;
}

export const AuthLayer = ({ children }: Props) => {
  const { loading, auth, queries } = useAuthLayer();

  if (loading && auth === null) {
    return (
      <PrimaryLoader text='Loading authentication status...' />
    );
  }

  if (!loading && auth === null) {
    return (
      <Navigate
        replace
        to={queries !== '' ? `/login?${queries}` : '/login'}
      />
    );
  }

  if (auth === null) {
    return (
      <Text variant='body1'>
        Something went horribly wrong. You should not see this.
      </Text>
    );
  }

  return children;
};
