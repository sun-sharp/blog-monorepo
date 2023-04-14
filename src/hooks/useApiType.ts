import { computed } from 'vue';
import { useApiTypeStore } from '@/store';
import { arrEnumToObj } from '@/utils';
import { COption } from '/#/config';

export const useApiType = () => {
  const apiTypeStore = useApiTypeStore();

  const getBillTypeOption = computed<COption[]>(() => apiTypeStore.getBillTypeOption);

  const getBillTypeMap = computed(() => arrEnumToObj(getBillTypeOption.value));

  const getBankTypeOption = computed<COption[]>(() => apiTypeStore.getBankTypeOption);

  return {
    getBillTypeOption,
    getBillTypeMap,
    getBankTypeOption,
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
