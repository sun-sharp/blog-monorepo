import App from './App.vue';
import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import GlobalLoading from './components/global-loading/global-loading.vue';

export function createApp() {
  const app = createSSRApp(App);
  app.use(createPinia());
  app.component('GlobalLoading', GlobalLoading);
  return {
    app,
  };
}
