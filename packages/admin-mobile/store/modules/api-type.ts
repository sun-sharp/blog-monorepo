import { defineStore } from 'pinia';
import { categoryApi } from '../../api';
import { categoryTypeEnum } from '../../../shared/src/constants/api-type';

export interface CNumOption {
  label: string;
  value: number;
}

export interface CStrOption {
  label: string;
  value: string;
}

export type IApiTypeState = {
  billTypeOption: CNumOption[];
  bankTypeOption: CNumOption[];
  billMethodOption: CNumOption[];
  imageSourceOption: CStrOption[];
  waitForDoClassifyOption: CNumOption[];
  articleCategoryOption: CNumOption[];
};

export const useApiTypeStore = defineStore({
  id: 'app-type',
  state: (): IApiTypeState => ({
    billTypeOption: [],
    bankTypeOption: [],
    billMethodOption: [],
    imageSourceOption: [],
    waitForDoClassifyOption: [],
    articleCategoryOption: [],
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
    async getBillType(bool: boolean = false) {
      if (!bool && this.billTypeOption.length > 0) return;
      try {
        const resp = await categoryApi.certainTypeAll(categoryTypeEnum.moneyBillType);
        this.billTypeOption = resp.map((m) => ({ label: m.label || '', value: m.value || 0 }));
      } catch {
        this.billTypeOption = [];
      }
    },
    async getBankType(bool: boolean = false) {
      if (!bool && this.bankTypeOption.length > 0) return;
      try {
        const resp = await categoryApi.certainTypeAll(categoryTypeEnum.moneyBankType);
        this.bankTypeOption = resp.map((m) => ({ label: m.label || '', value: m.value || 0 }));
      } catch {
        this.bankTypeOption = [];
      }
    },
    async getBillMethod(bool: boolean = false) {
      if (!bool && this.billMethodOption.length > 0) return;
      try {
        const resp = await categoryApi.certainTypeAll(categoryTypeEnum.moneyBillMethod);
        this.billMethodOption = resp.map((m) => ({ label: m.label || '', value: m.value || 0 }));
      } catch {
        this.billMethodOption = [];
      }
    },
    async getImageSource(bool: boolean = false) {
      if (!bool && this.imageSourceOption.length > 0) return;
      try {
        const resp = await categoryApi.certainTypeAll(categoryTypeEnum.capitalImageSource);
        this.imageSourceOption = resp.map((m) => ({ label: m.label, value: m.valueStr || '' }));
      } catch {
        this.imageSourceOption = [];
      }
    },
    async getWaitForDoClassify(bool: boolean = false) {
      if (!bool && this.waitForDoClassifyOption.length > 0) return;
      try {
        const resp = await categoryApi.certainTypeAll(categoryTypeEnum.capitalWaitForDoClassify);
        this.waitForDoClassifyOption = resp.map((m) => ({ label: m.label, value: m.value || 0 }));
      } catch {
        this.waitForDoClassifyOption = [];
      }
    },
    async getArticleCategory(bool: boolean = false) {
      console.log('获取文章分类, bool:', bool);
      // if (!bool && this.articleCategoryOption.length > 0) return;
      try {
        const resp = await categoryApi.certainTypeAll(categoryTypeEnum.blogArticleCategory);
        this.articleCategoryOption = resp.map((m) => ({ label: m.label, value: m.value || 0 }));
      } catch {
        this.articleCategoryOption = [];
      }
    },
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
      }
    },
  },
});
