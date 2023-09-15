import MakeitCaptcha from 'makeit-captcha';
import 'makeit-captcha/dist/captcha.min.css';
import type { App } from 'vue';

/**
 * 滑块验证码
 * @param app
 */
export const setupMakeitCaptcha = (app: App<Element>) => {
  app.use(MakeitCaptcha);
};
