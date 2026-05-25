import { ref, computed } from 'vue';
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

export const useApiTypeStore = () => {
  // ========== State (使用 ref 保证响应式) ==========
  const billTypeOption = ref<CNumOption[]>([]);
  const bankTypeOption = ref<CNumOption[]>([]);
  const billMethodOption = ref<CNumOption[]>([]);
  const imageSourceOption = ref<CStrOption[]>([]);
  const waitForDoClassifyOption = ref<CNumOption[]>([]);
  const articleCategoryOption = ref<CNumOption[]>([]);

  // ========== Getters (使用 computed 替代，解决鸿蒙端不更新问题) ==========
  const getBillTypeOption = computed(() => billTypeOption.value);
  const getBankTypeOption = computed(() => bankTypeOption.value);
  const getBillMethodOption = computed(() => billMethodOption.value);
  const getImageSourceOption = computed(() => imageSourceOption.value);
  const getWaitForDoClassifyOption = computed(() => waitForDoClassifyOption.value);
  const getArticleCategoryOption = computed(() => articleCategoryOption.value);

  // ========== Actions ==========
  async function getBillType(bool: boolean = false) {
    if (!bool && billTypeOption.value.length > 0) return;
    try {
      const resp = await categoryApi.certainTypeAll(categoryTypeEnum.moneyBillType);
      billTypeOption.value = resp.map((m) => ({ label: m.label || '', value: m.value || 0 }));
      console.log('getBillType try');
    } catch {
      billTypeOption.value = [];
      console.log('getBillType catch');
    }
  }

  async function getBankType(bool: boolean = false) {
    if (!bool && bankTypeOption.value.length > 0) return;
    try {
      const resp = await categoryApi.certainTypeAll(categoryTypeEnum.moneyBankType);
      bankTypeOption.value = resp.map((m) => ({ label: m.label || '', value: m.value || 0 }));
    } catch {
      bankTypeOption.value = [];
    }
  }

  async function getBillMethod(bool: boolean = false) {
    if (!bool && billMethodOption.value.length > 0) return;
    try {
      const resp = await categoryApi.certainTypeAll(categoryTypeEnum.moneyBillMethod);
      billMethodOption.value = resp.map((m) => ({ label: m.label || '', value: m.value || 0 }));
    } catch {
      billMethodOption.value = [];
    }
  }

  async function getImageSource(bool: boolean = false) {
    if (!bool && imageSourceOption.value.length > 0) return;
    try {
      const resp = await categoryApi.certainTypeAll(categoryTypeEnum.capitalImageSource);
      imageSourceOption.value = resp.map((m) => ({ label: m.label, value: m.valueStr || '' }));
    } catch {
      imageSourceOption.value = [];
    }
  }

  async function getWaitForDoClassify(bool: boolean = false) {
    if (!bool && waitForDoClassifyOption.value.length > 0) return;
    try {
      const resp = await categoryApi.certainTypeAll(categoryTypeEnum.capitalWaitForDoClassify);
      waitForDoClassifyOption.value = resp.map((m) => ({ label: m.label, value: m.value || 0 }));
    } catch {
      waitForDoClassifyOption.value = [];
    }
  }

  async function getArticleCategory(bool: boolean = false) {
    if (!bool && articleCategoryOption.value.length > 0) return;
    try {
      const resp = await categoryApi.certainTypeAll(categoryTypeEnum.blogArticleCategory);
      articleCategoryOption.value = resp.map((m) => ({ label: m.label, value: m.value || 0 }));
    } catch {
      articleCategoryOption.value = [];
    }
  }

  function againGetApiType(type: string) {
    switch (type) {
      case categoryTypeEnum.moneyBillType:
        getBillType(true);
        break;
      case categoryTypeEnum.moneyBankType:
        getBankType(true);
        break;
      case categoryTypeEnum.moneyBillMethod:
        getBillMethod(true);
        break;
      case categoryTypeEnum.capitalImageSource:
        getImageSource(true);
        break;
      case categoryTypeEnum.capitalWaitForDoClassify:
        getWaitForDoClassify(true);
        break;
      case categoryTypeEnum.blogArticleCategory:
        getArticleCategory(true);
        break;
    }
  }

  // ========== 返回所有需要暴露的属性和方法 ==========
  return {
    // state
    billTypeOption,
    bankTypeOption,
    billMethodOption,
    imageSourceOption,
    waitForDoClassifyOption,
    articleCategoryOption,
    // getters (computed)
    getBillTypeOption,
    getBankTypeOption,
    getBillMethodOption,
    getImageSourceOption,
    getWaitForDoClassifyOption,
    getArticleCategoryOption,
    // actions
    getBillType,
    getBankType,
    getBillMethod,
    getImageSource,
    getWaitForDoClassify,
    getArticleCategory,
    againGetApiType,
  };
};
