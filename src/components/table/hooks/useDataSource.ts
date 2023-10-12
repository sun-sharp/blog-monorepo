import { ref, unref, computed, onMounted } from 'vue';
import type { ExtractPropTypes, ComputedRef } from 'vue';
import { PaginationConfig, PaginationProps, TablePaginationParams } from '/#/components/table';
import { BasicTableProps } from './useBasicTable';
import { LIST_FIELD, PAGE_FIELD, SIZE_FIELD, TOTAL_FIELD } from '@/constant';
import at from 'await-to-js';
import { isArray } from '@/utils';

export const useDataSource = (
  props: ExtractPropTypes<typeof BasicTableProps>,
  emit: (event: 'fetch-error' | 'fetch-success', ...args: any[]) => void,
  options: {
    getPaginationInfo: ComputedRef<PaginationProps | false>;
    setPagination: (info: PaginationConfig) => void;
    setLoading: (loading: boolean) => void;
  }
) => {
  const dataSourceRef = ref<Recordable[]>([]);
  const { getPaginationInfo, setPagination, setLoading } = options;

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
    const { request } = props;
    if (!request) throw '查询接口出错';
    setLoading(true);

    const pageParams: TablePaginationParams = {};
    const paginationInfo = unref(getPaginationInfo);

    if (typeof paginationInfo !== 'boolean') {
      const { page = 1, pageSize = 10 } = paginationInfo;
      pageParams[PAGE_FIELD] = page;
      pageParams[SIZE_FIELD] = pageSize;
    }

    const [err, res] = await at(request(pageParams));
    if (err || !res) {
      console.error(err);
      emit('fetch-error', err);
      dataSourceRef.value = [];
      setPagination({
        [TOTAL_FIELD]: 0,
      });
      setLoading(false);
      return;
    }
    const resultTotal = res[TOTAL_FIELD] || 0;
    const currentPage = res[PAGE_FIELD];
    const resultList = res[LIST_FIELD];
    const resultInfo = isArray(resultList) ? resultList : [];
    dataSourceRef.value = resultInfo;
    setPagination({
      [PAGE_FIELD]: currentPage,
      [TOTAL_FIELD]: resultTotal,
      // [PAGE_COUNT_FIELD]:
    });
    emit('fetch-success', {
      items: unref(resultInfo),
      resultTotal,
    });
    setLoading(false);
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
