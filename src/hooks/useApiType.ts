import { computed } from 'vue';
import { useApiTypeStore } from '@/store';
import { arrEnumToObj } from '@/utils';
import { CNumOption, CStrOption } from '/#/config';

export const useApiType = () => {
  const apiTypeStore = useApiTypeStore();

  const getBillTypeOption = computed<CNumOption[]>(() => apiTypeStore.getBillTypeOption);

  const getBillTypeMap = computed(() => arrEnumToObj(getBillTypeOption.value));

  const getBankTypeOption = computed<CNumOption[]>(() => apiTypeStore.getBankTypeOption);

  const getBillMethodOption = computed<CNumOption[]>(() => apiTypeStore.getBillMethodOption);

  const getImageSourceOption = computed<CStrOption[]>(() => apiTypeStore.getImageSourceOption);

  const getWaitForDoClassifyOption = computed<CNumOption[]>(() => apiTypeStore.getWaitForDoClassifyOption);

  return {
    getBillTypeOption,
    getBillTypeMap,
    getBankTypeOption,
    getBillMethodOption,
    getImageSourceOption,
    getWaitForDoClassifyOption,
  };
};

// 获取账单类型数据
export const getBillTypeData = () => {
  const apiTypeStore = useApiTypeStore();
  apiTypeStore.getBillType();
};

// 获取银行类型数据
export const getBankTypeData = () => {
  const apiTypeStore = useApiTypeStore();
  apiTypeStore.getBankType();
};

// 获取账单方式数据
export const getBillMethodData = () => {
  const apiTypeStore = useApiTypeStore();
  apiTypeStore.getBillMethod();
};

// 获取图片来源数据
export const getImageSourceData = () => {
  const apiTypeStore = useApiTypeStore();
  apiTypeStore.getImageSource();
};

// 获取待办分类数据
export const getWaitForDoClassifyData = () => {
  const apiTypeStore = useApiTypeStore();
  apiTypeStore.getWaitForDoClassify();
};
