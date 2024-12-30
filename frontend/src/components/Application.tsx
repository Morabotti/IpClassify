import { ApplicationProviders, CenterMessage, PrimaryLoader } from '@components/common';
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthLayer } from '@components/auth';
import { ApplicationNavigation } from '@components/common';
import { HomeView } from '@components/home';
import { CatalogView } from '@components/catalog';
import { DoNotDisturb } from '@mui/icons-material';
import { WebSocketProvider } from '@contexts/WebSocketContext';
import { LoginView } from '@components/auth';
import { DetailsView } from '@components/details';

const Application = () => (
  <ApplicationProviders>
    <Suspense fallback={<PrimaryLoader />}>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={(
              <AuthLayer>
                <WebSocketProvider>
                  <ApplicationNavigation />
                </WebSocketProvider>
              </AuthLayer>
            )}
          >
            <Route index element={<HomeView />} />
            <Route path='catalog' element={<CatalogView />} />
            <Route path='catalog/:id' element={<DetailsView />} />
          </Route>
          <Route path='/login' element={<LoginView />} />
          <Route path='*' element={<CenterMessage icon={DoNotDisturb} text='PAGE NOT FOUND' title='404' />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </ApplicationProviders>
);

export default Application;
