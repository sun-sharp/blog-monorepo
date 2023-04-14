import type { App } from 'vue';
import { createPinia } from 'pinia';
import { useLockScreenStore, useLockScreenStoreWidthOut } from './modules/lock-screen';
import { useUserStore, useUserStoreWidthOut } from './modules/user';
import { useRouteStore, useRouteStoreWidthOut } from './modules/route';
import { useTabsViewStore } from './modules/tabs-view';
import { useApiTypeStore } from './modules/api-type';

export { useApiTypeStore, useLockScreenStore, useUserStore, useRouteStore, useTabsViewStore };

export { useLockScreenStoreWidthOut, useUserStoreWidthOut, useRouteStoreWidthOut };

const pinia = createPinia();

export function setupStore(app: App<Element>) {
  app.use(pinia);
}

export { pinia as store };
