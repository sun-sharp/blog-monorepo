import { defineStore } from 'pinia';
import { store } from '@/store';
import at from 'await-to-js';
import { categoryApi } from '@/api';

// 分类类型
enum categoryTypeEnum {
  moneyBillType = 'money_bill_type', // 金额账单类型
}

export type IApiTypeState = {
  billTypeOption: any[]; // 账单类型
};

export const useApiTypeStore = defineStore({
  id: 'app-apiType',
  state: (): IApiTypeState => ({
    billTypeOption: [], // 账单类型
  }),
  getters: {
    getBillTypeOption(): any[] {
      return this.billTypeOption;
    },
  },
  actions: {
    // 获取账单类型
    async getBillType() {
      // 已经加载的数据，取消重复加载
      if (this.billTypeOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.moneyBillType));
      if (err || !resp) {
        this.billTypeOption = [];
        return;
      }
      this.billTypeOption = resp.map((m: { label: string; value: number }) => ({
        label: m.label,
        value: m.value,
      }));
    },
  },
});

// 需要在设置之外使用
export function useApiTypeStoreWidthOut() {
  return useApiTypeStore(store);
}
