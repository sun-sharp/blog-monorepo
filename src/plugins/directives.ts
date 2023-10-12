import type { App } from 'vue';
import { pressKey } from '@/plugins/directives/pressKey';

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  app.directive('press-key', pressKey);
}
