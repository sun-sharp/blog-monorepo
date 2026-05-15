import { createRoot } from 'react-dom/client';
import './styles/index.scss';
import { store } from '@/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './router/index.tsx';
import { AliveScope } from 'react-activation';
import SharpProvider from '@/components/sharp/SharpProvider';
import { setupHeartAnimation } from './plugins/canvas/heart.ts';
import { registerPWAUpdateListener } from './utils/pwa';

setupHeartAnimation();
registerPWAUpdateListener();

const container = document.getElementById('root');
const root = createRoot(container as HTMLDivElement);
root.render(
  <SharpProvider>
    <Provider store={store}>
      <BrowserRouter>
        <AliveScope>
          <Router />
        </AliveScope>
      </BrowserRouter>
    </Provider>
  </SharpProvider>
);
