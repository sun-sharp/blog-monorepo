import { computed, unref, ref, ExtractPropTypes } from 'vue';
import { PaginationConfig, PaginationProps } from '/#/components/table';
import { isBoolean } from '@/utils';
import { DEFAULT_PAGESIZE, PAGE_COUNT_FIELD, PAGE_SIZES, TOTAL_FIELD } from '@/constant';
import { BasicTableProps } from './useBasicTable';

export function usePagination(props: ExtractPropTypes<typeof BasicTableProps>) {
  const configRef = ref<PaginationConfig>({});
  const show = ref(true);

  const getPaginationInfo = computed<PaginationProps | false>(() => {
    const { pagination } = props;
    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false;
    }
    return {
      pageSize: DEFAULT_PAGESIZE,
      pageSizes: PAGE_SIZES,
      showSizePicker: true,
      showQuickJumper: true,
      pageCount: unref(configRef)[PAGE_COUNT_FIELD],
      itemCount: unref(configRef)[TOTAL_FIELD],
      ...(isBoolean(pagination) ? {} : pagination),
    };
  });

  // 设置分页
  const setPagination = (info: Partial<PaginationProps>) => {
    const paginationInfo = unref(getPaginationInfo);
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    };
  };

  // 获取分页
  const getPagination = (): PaginationProps | boolean => {
    return unref(getPaginationInfo);
  };

  return {
    getPagination,
    getPaginationInfo,
    setPagination,
  };
}
