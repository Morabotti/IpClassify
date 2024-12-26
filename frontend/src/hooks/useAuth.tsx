import { use } from 'react';
import { AuthContext } from '@contexts/AuthContext';

export const useAuth = () => use(AuthContext);
