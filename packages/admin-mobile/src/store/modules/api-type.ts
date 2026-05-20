import { defineStore } from 'pinia';
import { categoryApi } from '@/api';
import { ApiCategoryItem } from '/#/api/capital/category';
import { categoryTypeEnum } from '@/constant';

interface ApiTypeState {
  billTypeOption: ApiCategoryItem[];
  bankTypeOption: ApiCategoryItem[];
  billMethodOption: ApiCategoryItem[];
  imageSourceOption: ApiCategoryItem[];
  waitForDoClassifyOption: ApiCategoryItem[];
  articleCategoryOption: ApiCategoryItem[];
}

export const useApiTypeStore = defineStore({
  id: 'app-apiType',
  state: (): ApiTypeState => ({
    billTypeOption: [],
    bankTypeOption: [],
    billMethodOption: [],
    imageSourceOption: [],
    waitForDoClassifyOption: [],
    articleCategoryOption: [],
  }),
  actions: {
    async getBillTypeOption(bool = false) {
      if (!bool && this.billTypeOption.length) return;
      this.billTypeOption = await categoryApi.certainTypeAll(categoryTypeEnum.moneyBillType);
    },
    async getBankTypeOption(bool = false) {
      if (!bool && this.bankTypeOption.length) return;
      this.bankTypeOption = await categoryApi.certainTypeAll(categoryTypeEnum.moneyBankType);
    },
    async getBillMethodOption(bool = false) {
      if (!bool && this.billMethodOption.length) return;
      this.billMethodOption = await categoryApi.certainTypeAll(categoryTypeEnum.moneyBillMethod);
    },
    async getImageSourceOption(bool = false) {
      if (!bool && this.imageSourceOption.length) return;
      this.imageSourceOption = await categoryApi.certainTypeAll(categoryTypeEnum.capitalImageSource);
    },
    async getWaitForDoClassifyOption(bool = false) {
      if (!bool && this.waitForDoClassifyOption.length) return;
      this.waitForDoClassifyOption = await categoryApi.certainTypeAll(categoryTypeEnum.capitalWaitForDoClassify);
    },
    async getArticleCategoryOption(bool = false) {
      if (!bool && this.articleCategoryOption.length) return;
      this.articleCategoryOption = await categoryApi.certainTypeAll(categoryTypeEnum.blogArticleCategory);
    },
    async againGetApiType(type: string) {
      const typeMap: Record<string, () => Promise<void>> = {
        billType: () => this.getBillTypeOption(true),
        bankType: () => this.getBankTypeOption(true),
        billMethod: () => this.getBillMethodOption(true),
        imageSource: () => this.getImageSourceOption(true),
        waitForDoClassify: () => this.getWaitForDoClassifyOption(true),
        articleCategory: () => this.getArticleCategoryOption(true),
      };
      if (typeMap[type]) {
        await typeMap[type]();
      }
    },
  },
});

export function useApiTypeStoreWidthOut() {
  return useApiTypeStore();
}
