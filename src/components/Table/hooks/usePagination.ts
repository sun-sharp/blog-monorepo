import { computed, unref, ref, ExtractPropTypes } from 'vue';
import { PaginationProps } from '/#/components/table';
import { isBoolean } from '@/utils';
import { DEFAULT_PAGESIZE, PAGE_COUNT_FIELD, PAGE_SIZES, TOTAL_FIELD } from '@/constant';
import { BasicTableProps } from './useBasicTable';

export function usePagination(props: ExtractPropTypes<typeof BasicTableProps>) {
  const configRef = ref<PaginationProps>({});
  const show = ref(true);

  const getPaginationInfo = computed((): PaginationProps | false => {
    const { pagination } = unref(props);
    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false;
    }
    return {
      pageSize: DEFAULT_PAGESIZE,
      pageSizes: PAGE_SIZES,
      showSizePicker: true,
      showQuickJumper: true,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
      pageCount: unref(configRef)[PAGE_COUNT_FIELD],
      itemCount: unref(configRef)[TOTAL_FIELD],
    };
  });

  const setPagination = (info: Partial<PaginationProps>) => {
    const paginationInfo = unref(getPaginationInfo);
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    };
  };

  const getPagination = (): PaginationProps | boolean => {
    return unref(getPaginationInfo);
  };

  // const getShowPagination = (): boolean => {
  //   return unref(show);
  // };

  // const setShowPagination = async (flag: boolean) => {
  //   show.value = flag;
  // };

  return {
    getPagination,
    getPaginationInfo,
    // setShowPagination, getShowPagination,
    setPagination,
  };
}
