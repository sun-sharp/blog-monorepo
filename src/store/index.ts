import type { App } from 'vue';
import { createPinia } from 'pinia';
import { useLockScreenStore, useLockScreenStoreWidthOut } from './modules/lock-screen';
import { useUserStore, useUserStoreWidthOut } from './modules/user';
import { useProjectSettingStore, useProjectSettingStoreWithOut } from '@/store/modules/project-setting';
import { useDesignSettingStore, useDesignSettingWithOut } from '@/store/modules/design-setting';
import { useRouteStore, useRouteStoreWidthOut } from './modules/route';
import { useTabsViewStore } from './modules/tabs-view';

export { useLockScreenStore, useUserStore, useProjectSettingStore, useDesignSettingStore, useRouteStore, useTabsViewStore };

export { useLockScreenStoreWidthOut, useUserStoreWidthOut, useProjectSettingStoreWithOut, useDesignSettingWithOut, useRouteStoreWidthOut };

const pinia = createPinia();

export function setupStore(app: App<Element>) {
  app.use(pinia);
}

export { pinia as store };
