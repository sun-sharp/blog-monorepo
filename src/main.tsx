import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';
import { store } from '@/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './router/index.tsx';
import SharpProvider from '@/components/sharp/SharpProvider';

const container = document.getElementById('root');
const root = createRoot(container as HTMLDivElement);
root.render(
  <StrictMode>
    <SharpProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </Provider>
    </SharpProvider>
  </StrictMode>
);
