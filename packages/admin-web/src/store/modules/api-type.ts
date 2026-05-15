import { defineStore } from 'pinia';
import { store } from '@/store';
import at from 'await-to-js';
import { categoryApi } from '@/api';
import { CNumOption, CStrOption } from '/#/config';
import { categoryTypeEnum } from '@/constant';

export type IApiTypeState = {
  billTypeOption: CNumOption[]; // 账单类型
  bankTypeOption: CNumOption[]; // 金额银行类型
  billMethodOption: CNumOption[]; // 金额账单方式
  imageSourceOption: CStrOption[]; // 图片来源
  waitForDoClassifyOption: CNumOption[]; // 待办分类
  articleCategoryOption: CNumOption[]; // 文章类型
};

export const useApiTypeStore = defineStore({
  id: 'app-apiType',
  state: (): IApiTypeState => ({
    billTypeOption: [], // 账单类型
    bankTypeOption: [], // 金额银行类型
    billMethodOption: [], // 金额账单方式
    imageSourceOption: [], // 图片来源
    waitForDoClassifyOption: [], // 待办分类
    articleCategoryOption: [], // 文章类型
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
    getArticleCategoryOption(): CNumOption[] {
      return this.articleCategoryOption;
    },
  },
  actions: {
    // 获取账单类型
    async getBillType(bool: boolean = false) {
      // 已经加载的数据，取消重复加载
      if (!bool && this.billTypeOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.moneyBillType));
      if (err || !resp) {
        this.billTypeOption = [];
        return;
      }
      this.billTypeOption = resp.map((m) => ({
        label: m.label || '',
        value: m.value || 0,
      }));
    },
    // 获取银行类型
    async getBankType(bool: boolean = false) {
      // 已经加载的数据，取消重复加载
      if (!bool && this.bankTypeOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.moneyBankType));
      if (err || !resp) {
        this.bankTypeOption = [];
        return;
      }
      this.bankTypeOption = resp.map((m) => ({
        label: m.label || '',
        value: m.value || 0,
      }));
    },
    // 获取账单方式
    async getBillMethod(bool: boolean = false) {
      // 已经加载的数据，取消重复加载
      if (!bool && this.billMethodOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.moneyBillMethod));
      if (err || !resp) {
        this.billMethodOption = [];
        return;
      }
      this.billMethodOption = resp.map((m) => ({
        label: m.label || '',
        value: m.value || 0,
      }));
    },
    // 获取图片来源
    async getImageSource(bool: boolean = false) {
      // 已经加载的数据，取消重复加载
      if (!bool && this.imageSourceOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.capitalImageSource));
      if (err || !resp) {
        this.imageSourceOption = [];
        return;
      }
      this.imageSourceOption = resp.map((m) => ({
        label: m.label,
        value: m.valueStr || '',
      }));
    },
    // 获取待办分类
    async getWaitForDoClassify(bool: boolean = false) {
      // 已经加载的数据，取消重复加载
      if (!bool && this.waitForDoClassifyOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.capitalWaitForDoClassify));
      if (err || !resp) {
        this.waitForDoClassifyOption = [];
        return;
      }
      this.waitForDoClassifyOption = resp.map((m) => ({
        label: m.label,
        value: m.value || 0,
      }));
    },
    // 获取文章类型
    async getArticleCategory(bool: boolean = false) {
      // 已经加载的数据，取消重复加载
      if (!bool && this.articleCategoryOption.length > 0) {
        return;
      }
      const [err, resp] = await at(categoryApi.certainTypeAll(categoryTypeEnum.blogArticleCategory));
      if (err || !resp) {
        this.articleCategoryOption = [];
        return;
      }
      this.articleCategoryOption = resp.map((m) => ({
        label: m.label,
        value: m.value || 0,
      }));
    },
    // 重新获取全局类型
    againGetApiType(type: string) {
      switch (type) {
        case categoryTypeEnum.moneyBillType:
          this.getBillType(true);
          break;
        case categoryTypeEnum.moneyBankType:
          this.getBankType(true);
          break;
        case categoryTypeEnum.moneyBillMethod:
          this.getBillMethod(true);
          break;
        case categoryTypeEnum.capitalImageSource:
          this.getImageSource(true);
          break;
        case categoryTypeEnum.capitalWaitForDoClassify:
          this.getWaitForDoClassify(true);
          break;
        case categoryTypeEnum.blogArticleCategory:
          this.getArticleCategory(true);
          break;
        default:
          break;
      }
    },
  },
});

// 需要在设置之外使用
export function useApiTypeStoreWidthOut() {
  return useApiTypeStore(store);
}
