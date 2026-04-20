/**
 * PWA 更新提示组件
 * 当有新的 Service Worker 可用时，提示用户刷新页面
 */

import { message } from 'antd';

let updateMessageShown = false;

export const registerPWAUpdateListener = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration) => {
      registration.addEventListener?.('updatefound', () => {
        const installingWorker = (registration as unknown as Record<string, unknown>).installing as ServiceWorker | undefined;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 有新的更新可用
            if (!updateMessageShown) {
              updateMessageShown = true;
              message.info('发现新版本，点击确定刷新页面', 0);
            }
          }
        });
      });
    });
  }
};

/**
 * 刷新页面以应用更新
 */
export const refreshForUpdate = () => {
  window.location.reload();
};
