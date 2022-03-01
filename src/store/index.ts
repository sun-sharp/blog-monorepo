import type { App } from 'vue';
import { createPinia } from 'pinia';
import { useLockScreenStore, useLockScreenStoreWidthOut } from './modules/lock-screen';
import { useUserStore, useUserStoreWidthOut } from './modules/user';
import { useProjectSettingStore, useProjectSettingStoreWithOut } from '@/store/modules/project-setting';
import { useDesignSettingStore, useDesignSettingWithOut } from '@/store/modules/design-setting';

export { useLockScreenStore, useUserStore, useProjectSettingStore, useDesignSettingStore };

export { useLockScreenStoreWidthOut, useUserStoreWidthOut, useProjectSettingStoreWithOut, useDesignSettingWithOut };

const pinia = createPinia();

export function setupStore(app: App<Element>) {
  app.use(pinia);
}

export { pinia as store };
