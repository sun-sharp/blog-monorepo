import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store';
import MakeitCaptcha from 'makeit-captcha';
import 'makeit-captcha/dist/captcha.min.css';
import {
  setupNaive,
  setupMdEditor,
  // setupDirectives,
} from '@/plugins';

const app = createApp(App);

// 滑块验证码
app.use(MakeitCaptcha);

// 注册全局常用的 naive-ui 组件
setupNaive(app);

// 注册全局自定义指令
// setupDirectives(app);

// 挂载状态管理
setupStore(app);

// 挂载路由
setupRouter(app);

// 挂载 markdown 编辑器
setupMdEditor(app);

app.mount('#app');
