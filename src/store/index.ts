import type { App } from 'vue';
import { createPinia } from 'pinia';
import { useLockScreenStore, useLockScreenStoreWidthOut } from './modules/lock-screen';
import { useUserStore, useUserStoreWidthOut } from './modules/user';
import { useSettingStore, useSettingStoreWithOut } from '@/store/modules/setting';
import { useRouteStore, useRouteStoreWidthOut } from './modules/route';
import { useTabsViewStore } from './modules/tabs-view';

export { useLockScreenStore, useUserStore, useSettingStore, useRouteStore, useTabsViewStore };

export { useLockScreenStoreWidthOut, useUserStoreWidthOut, useSettingStoreWithOut, useRouteStoreWidthOut };

const pinia = createPinia();

export function setupStore(app: App<Element>) {
  app.use(pinia);
}

export { pinia as store };
