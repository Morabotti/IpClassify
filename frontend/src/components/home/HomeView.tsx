import { authApi } from '@client';
import { LocalStorageKey } from '@enums';
import { Button } from '@mui/material';

export const HomeView = () => {
  return (
    <div>
      <Button onClick={() => authApi.getMe(localStorage.getItem(LocalStorageKey.Token) ?? '')}>getMe</Button>
      <Button onClick={() => authApi.authenticate({ username: 'dsds', password: 'dsa' })}>authenticate</Button>
      home
    </div>
  );
};
