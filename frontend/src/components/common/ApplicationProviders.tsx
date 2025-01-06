import { FC, ReactNode } from 'react';
import { colors, CssBaseline, GlobalStyles, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme } from '@theme';
import { LocalStorageKey } from '@enums';
import { AuthProvider } from '@contexts/AuthContext';
import { NotificationProvider } from '@contexts/NotificationContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 30 * 1000,
      gcTime: 1 * 60 * 1000,
      retry: 0
    }
  }
});

interface Props {
  children: ReactNode;
}

export const ApplicationProviders: FC<Props> = ({ children }: Props) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider
        theme={theme}
        modeStorageKey={LocalStorageKey.ThemeMode}
        colorSchemeStorageKey={LocalStorageKey.ThemeSchema}
        disableTransitionOnChange
      >
        <CssBaseline enableColorScheme />
        <GlobalStyles
          styles={{
            'html, body, #mount, ': {
              height: '100%',
              width: '100%',
              margin: 0
            },
            '#mount': {
              display: 'flex',
              flexDirection: 'column'
            },
            '& *::-webkit-scrollbar': {
              width: 5,
              height: 8,
              backgroundColor: 'rgba(0,0,0,0.06)'
            },
            '& *::-webkit-scrollbar-thumb': {
              backgroundColor: colors.grey[500],
              borderRadius: 2
            }
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <QueryClientProvider client={queryClient}>
            <NotificationProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </NotificationProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
