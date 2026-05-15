import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store';
import { setupNaive, setupDirectives, setupMakeitCaptcha } from '@/plugins';

const bootstrap = async () => {
  const app = createApp(App);

  // 注册全局自定义指令
  setupDirectives(app);

  // 注册全局常用的 naive-ui 组件
  setupNaive(app);

  // 挂载状态管理
  setupStore(app);

  // 挂载路由
  setupRouter(app);

  // 滑块验证码
  setupMakeitCaptcha(app);

  app.mount('#app');
};

bootstrap();
