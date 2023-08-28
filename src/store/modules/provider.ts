import { defineStore } from 'pinia';
import { store } from '@/store';
import { ProviderState } from '/#/store';
import { useMessage } from 'naive-ui';
import { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

export const useProviderStore = defineStore({
  id: 'app-provider',
  state: (): ProviderState => ({}),
  getters: {
    // 设置信息提示
    getMessage(): MessageApiInjection {
      return useMessage();
    },
  },
  actions: {
    // 设置加载条
    setLoading(loading: LoadingBarApiInjection) {
      this.loading = loading;
    },
    // 设置弹窗
    setDialog(dialog: DialogApiInjection) {
      this.dialog = dialog;
    },
    // 设置信息提示
    setMessage(message: MessageApiInjection) {
      this.message = message;
    },
  },
});

/**
 * @description: 需要在设置之外使用
 */
export const useProviderStoreWidthOut = () => {
  return useProviderStore(store);
};
