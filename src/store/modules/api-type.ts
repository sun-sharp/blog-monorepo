import { defineStore } from 'pinia';
import { store } from '@/store';
import at from 'await-to-js';
import { categoryApi } from '@/api';
import { COption } from '/#/config';

// 分类类型
enum categoryTypeEnum {
  moneyBillType = 'money_bill_type', // 金额账单类型
  moneyBankType = 'money_bank_type', // 金额银行类型
  moneyBillMethod = 'money_bill_method', // 金额账单方式
  capitalMenuType = 'capital_menu_type', // 金额账单类型
}

export type IApiTypeState = {
  billTypeOption: COption[]; // 账单类型
  bankTypeOption: COption[]; // 金额银行类型
};

export const useApiTypeStore = defineStore({
  id: 'app-apiType',
  state: (): IApiTypeState => ({
    billTypeOption: [], // 账单类型
    bankTypeOption: [], // 金额银行类型
  }),
  getters: {
    getBillTypeOption(): COption[] {
      return this.billTypeOption;
    },
    getBankTypeOption(): COption[] {
      return this.bankTypeOption;
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
    // 获取银行类型
    async getBankType() {
      // 已经加载的数据，取消重复加载
      if (this.bankTypeOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.moneyBankType));
      if (err || !resp) {
        this.bankTypeOption = [];
        return;
      }
      this.bankTypeOption = resp.map((m: { label: string; value: number }) => ({
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
