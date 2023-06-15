import type { App } from 'vue';
import { clickOutside } from '@/plugins/directives/clickOutside';
import { pressKey } from '@/plugins/directives/pressKey';

/**
 * 注册全局自定义指令
 * @param app
 */
export function setupDirectives(app: App) {
  app.directive('click-outside', clickOutside);
  app.directive('press-key', pressKey);
}
