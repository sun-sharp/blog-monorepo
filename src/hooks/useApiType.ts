import { computed } from 'vue';
import { useApiTypeStore } from '@/store';
import { arrEnumToObj } from '@/utils';

export const useApiType = () => {
  const apiTypeStore = useApiTypeStore();

  const getBillTypeOption = computed<any[]>(() => apiTypeStore.getBillTypeOption);

  const getBillTypeMap = computed(() => arrEnumToObj(getBillTypeOption.value));

  return {
    getBillTypeOption,
    getBillTypeMap,
  };
};

export const getBillTypeData = () => {
  const apiTypeStore = useApiTypeStore();
  apiTypeStore.getBillType();
};
