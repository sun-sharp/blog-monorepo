import { defineStore } from 'pinia';
import { store } from '@/store';
import at from 'await-to-js';
import { categoryApi } from '@/api';
import { CNumOption, CStrOption } from '/#/config';

// 分类类型
enum categoryTypeEnum {
  moneyBillType = 'money_bill_type', // 金额账单类型
  moneyBankType = 'money_bank_type', // 金额银行类型
  moneyBillMethod = 'money_bill_method', // 金额账单方式
  capitalImageSource = 'capital_image_source', // 图片来源
  capitalWaitForDoClassify = 'capital_wait-for-do_classify', // 待办分类
}

export type IApiTypeState = {
  billTypeOption: CNumOption[]; // 账单类型
  bankTypeOption: CNumOption[]; // 金额银行类型
  billMethodOption: CNumOption[]; // 金额账单方式
  imageSourceOption: CStrOption[]; // 图片来源
  waitForDoClassifyOption: CNumOption[]; // 待办分类
};

export const useApiTypeStore = defineStore({
  id: 'app-apiType',
  state: (): IApiTypeState => ({
    billTypeOption: [], // 账单类型
    bankTypeOption: [], // 金额银行类型
    billMethodOption: [], // 金额账单方式
    imageSourceOption: [], // 图片来源
    waitForDoClassifyOption: [], // 待办分类
  }),
  getters: {
    getBillTypeOption(): CNumOption[] {
      return this.billTypeOption;
    },
    getBankTypeOption(): CNumOption[] {
      return this.bankTypeOption;
    },
    getBillMethodOption(): CNumOption[] {
      return this.billMethodOption;
    },
    getImageSourceOption(): CStrOption[] {
      return this.imageSourceOption;
    },
    getWaitForDoClassifyOption(): CNumOption[] {
      return this.waitForDoClassifyOption;
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
    // 获取账单方式
    async getBillMethod() {
      // 已经加载的数据，取消重复加载
      if (this.billMethodOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.moneyBillMethod));
      if (err || !resp) {
        this.billMethodOption = [];
        return;
      }
      this.billMethodOption = resp.map((m: { label: string; value: number }) => ({
        label: m.label,
        value: m.value,
      }));
    },
    // 获取图片来源
    async getImageSource() {
      // 已经加载的数据，取消重复加载
      if (this.imageSourceOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.capitalImageSource));
      if (err || !resp) {
        this.imageSourceOption = [];
        return;
      }
      this.imageSourceOption = resp.map((m: { label: string; valueStr: string }) => ({
        label: m.label,
        value: m.valueStr,
      }));
    },
    // 获取待办分类
    async getWaitForDoClassify() {
      // 已经加载的数据，取消重复加载
      if (this.waitForDoClassifyOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.capitalWaitForDoClassify));
      if (err || !resp) {
        this.waitForDoClassifyOption = [];
        return;
      }
      this.waitForDoClassifyOption = resp.map((m: { label: string; value: string }) => ({
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
