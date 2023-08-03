import { ref, unref, computed, onMounted, watchEffect, watch } from 'vue';
import type { ExtractPropTypes, ComputedRef, Ref } from 'vue';
import { PaginationParams, PaginationProps, PaginationResult } from '/#/components/table';
import { isBoolean } from '@/utils';
import { BasicTableProps } from './useBasicTable';

export const useDataSource = (
  props: ExtractPropTypes<typeof BasicTableProps>,
  emit: (event: 'fetch-error' | 'fetch-success', args: any[]) => void,
  options: {
    getPaginationInfo: ComputedRef<PaginationProps | boolean>;
    setPagination: (info: Partial<PaginationProps>) => void;
    setLoading: (loading: boolean) => void;
    tableData: Ref<Recordable[]>;
  }
) => {
  const dataSourceRef = ref<any[]>([]);
  const { getPaginationInfo, setPagination, setLoading, tableData } = options;

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });

  watch(
    () => unref(props).dataSource,
    () => {
      const { dataSource }: any = unref(props);
      dataSource && (dataSourceRef.value = dataSource);
    },
    {
      immediate: true,
    }
  );

  const getRowKey = computed(() => {
    const { rowKey }: any = unref(props);
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

  const fetch = async (opt?: { [x: string]: any } | undefined) => {
    try {
      setLoading(true);
      const { request, pagination }: any = unref(props);

      let pageParams: PaginationParams = {};
      const { current = 1, pageSize = 10 } = unref(getPaginationInfo) as PaginationProps;

      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {};
      } else {
        pageParams[pageField] = (opt && opt[pageField]) || current;
        pageParams[sizeField] = pageSize;
      }

      const params = {
        ...pageParams,
      };
      const res: PaginationResult = await request(params);

      const resultTotal = res[totalField] || 0;
      const currentPage = res[pageField];

      // 如果数据异常，需获取正确的页码再次执行
      if (resultTotal) {
        if (current > resultTotal) {
          setPagination({
            [pageField]: currentPage,
          });
          fetch(opt);
        }
      }
      const resultInfo = res[listField] ? res[listField] : [];
      dataSourceRef.value = resultInfo;
      setPagination({
        [pageField]: currentPage,
        [totalField]: resultTotal,
      });
      if (opt && opt[pageField]) {
        setPagination({
          [pageField]: opt[pageField] || 1,
        });
      }
      emit('fetch-success', {
        items: unref(resultInfo),
        resultTotal,
      });
    } catch (error) {
      console.error(error);
      emit('fetch-error', error);
      dataSourceRef.value = [];
      // setPagination({
      //   pageCount: 0,
      // });
    } finally {
      setLoading(false);
    }
  };

  onMounted(() => {
    setTimeout(() => {
      fetch();
    }, 16);
  });

  function setTableData(values: never[]) {
    dataSourceRef.value = values;
  }

  function getDataSource(): any[] {
    return getDataSourceRef.value;
  }

  async function reload(opt?: any) {
    await fetch(opt);
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
