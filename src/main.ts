import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from '@/store';
import MakeitCaptcha from 'makeit-captcha';
import 'makeit-captcha/dist/captcha.min.css';
import { setupNaive, setupDirectives } from '@/plugins';
import { AppProvider } from '@/components/Application';

const appProvider = createApp(AppProvider);

const app = createApp(App);

// 滑块验证码
app.use(MakeitCaptcha);

// 注册全局常用的 naive-ui 组件
setupNaive(app);

// 注册全局自定义指令
setupDirectives(app);

// 优先挂载一下 Provider 解决路由守卫，Axios中可使用，Dialog，Message 等之类组件
appProvider.mount('#appProvider', true);

// 挂载状态管理
setupStore(app);

// 挂载路由
setupRouter(app);

app.mount('#app');
