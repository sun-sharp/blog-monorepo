import { computed, unref, ref, ExtractPropTypes } from 'vue';
import { PaginationConfig, PaginationProps } from '/#/components/table';
import { isBoolean } from '@/utils';
import { DEFAULT_PAGESIZE, PAGE_COUNT_FIELD, PAGE_FIELD, PAGE_SIZES, SIZE_FIELD, TOTAL_FIELD } from '@/constant';
import { BasicTableProps } from './useBasicTable';
import { PaginationInfo } from 'naive-ui';

export function usePagination(props: ExtractPropTypes<typeof BasicTableProps>) {
  const configRef = ref<PaginationConfig>({});
  const show = ref(true);

  const getPaginationInfo = computed<PaginationProps | false>(() => {
    const { pagination } = props;
    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false;
    }
    const basePagination: PaginationProps = {
      page: unref(configRef)[PAGE_FIELD] || 1,
      pageSize: unref(configRef)[SIZE_FIELD] || DEFAULT_PAGESIZE,
      pageSizes: PAGE_SIZES,
      showSizePicker: true,
      showQuickJumper: true,
      pageCount: unref(configRef)[PAGE_COUNT_FIELD],
      itemCount: unref(configRef)[TOTAL_FIELD],
      prefix: (info: PaginationInfo) => `共 ${info.itemCount} 项`,
    };
    if (isBoolean(pagination)) {
      return basePagination;
    }
    return { ...basePagination, ...(pagination as PaginationProps) };
  });

  // 设置分页
  const setPagination = (info: PaginationConfig) => {
    configRef.value = {
      ...unref(configRef),
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
