import { ref, unref, computed, onMounted } from 'vue';
import type { ExtractPropTypes, ComputedRef } from 'vue';
import { PaginationProps, TablePaginationParams, TablePaginationResult } from '/#/components/table';
import { BasicTableProps } from './useBasicTable';
import { LIST_FIELD, PAGE_FIELD, SIZE_FIELD, TOTAL_FIELD } from '@/constant';

export const useDataSource = (
  props: ExtractPropTypes<typeof BasicTableProps>,
  emit: (event: 'fetch-error' | 'fetch-success', ...args: any[]) => void,
  options: {
    getPaginationInfo: ComputedRef<PaginationProps | boolean>;
    setPagination: (info: Partial<PaginationProps>) => void;
    setLoading: (loading: boolean) => void;
  }
) => {
  const dataSourceRef = ref<Recordable[]>([]);
  const { getPaginationInfo, setPagination, setLoading } = options;

  // watch(
  //   () => unref(props).dataSource,
  //   () => {
  //     const { dataSource }: any = unref(props);
  //     dataSource && (dataSourceRef.value = dataSource);
  //   },
  //   {
  //     immediate: true,
  //   }
  // );

  const getRowKey = computed(() => {
    const { rowKey } = props;
    return rowKey
      ? rowKey
      : () => {
          return 'key';
        };
  });

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    return unref(dataSourceRef);
  });

  const fetch = async () => {
    try {
      const { request } = props;
      if (!request) throw '查询接口出错';
      setLoading(true);

      const pageParams: TablePaginationParams = {};
      const paginationInfo = unref(getPaginationInfo);

      if (typeof paginationInfo !== 'boolean') {
        const { page = 1, size = 10 } = paginationInfo;
        pageParams[PAGE_FIELD] = page;
        pageParams[SIZE_FIELD] = size;
      }

      const res: TablePaginationResult = await request(pageParams);

      const resultTotal = res[TOTAL_FIELD] || 0;
      const currentPage = res[PAGE_FIELD];

      // 如果数据异常，需获取正确的页码再次执行
      if (resultTotal && typeof paginationInfo !== 'boolean') {
        const { page = 1 } = paginationInfo;
        if (page > resultTotal) {
          setPagination({ page: currentPage });
          fetch();
        }
      }
      const resultInfo = res[LIST_FIELD] ? res[LIST_FIELD] : [];
      dataSourceRef.value = resultInfo;
      setPagination({
        page: currentPage,
        total: resultTotal,
      });
      emit('fetch-success', {
        items: unref(resultInfo),
        resultTotal,
      });
    } catch (error) {
      console.error(error);
      emit('fetch-error', error);
      dataSourceRef.value = [];
      setPagination({
        pageCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  onMounted(() => {
    setTimeout(() => {
      fetch();
    }, 16);
  });

  const setTableData = (values: Recordable[]) => {
    dataSourceRef.value = values;
  };

  const getDataSource = (): Recordable[] => {
    return getDataSourceRef.value;
  };

  async function reload() {
    await fetch();
  }

  return {
    fetch,
    getRowKey,
    getDataSourceRef,
    getDataSource,
    setTableData,
    reload,
  };
};
