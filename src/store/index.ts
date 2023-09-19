import type { App } from 'vue';
import { createPinia } from 'pinia';

// 导出
export { useLockScreenStore, useLockScreenStoreWidthOut } from './modules/lock-screen';
export { useUserStore, useUserStoreWidthOut } from './modules/user';
export { useRouteStore, useRouteStoreWidthOut } from './modules/route';
export { useTabsViewStore } from './modules/tabs-view';
// export { useApiTypeStore } from './modules/api-type';

const pinia = createPinia();

export function setupStore(app: App<Element>) {
  app.use(pinia);
}

export { pinia as store };
