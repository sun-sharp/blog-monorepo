import { useDataSource } from './useDataSource';
import { usePagination } from './usePagination';
import { useTableColumns } from './useTableColumns';
import { BasicColumn, TablePaginationParams, PaginationProps, TableSizeType } from '/#/components/table';
import { ExtractPropTypes, computed, reactive, ref, toRaw, toRefs, unref, watch } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { useMainSize } from '@/hooks';
// import { useLoading } from './useLoading';

// 基础表格 传参
export const BasicTableProps = {
  // 加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 表格头部标题
  title: {
    type: String,
  },
  // 表格头部标题信息
  titleTooltip: {
    type: String,
  },
  // 表格密度
  size: {
    type: String as PropType<TableSizeType>,
    default: 'medium',
  },
  // 需要展示的列
  columns: {
    type: [Array] as PropType<BasicColumn[]>,
    default: () => [],
    required: true,
  },
  // 自定义查询数据方法
  request: {
    type: Function as PropType<(params: TablePaginationParams) => Promise<any>>,
    required: true,
  },
  // 通过行数据创建行的 key（如果你不想给每一行加上 key）
  rowKey: {
    type: [String, Function] as PropType<string | ((record: any) => string)>,
  },
  // 是否启动表格高度随着屏幕变化
  canResize: {
    type: Boolean,
    default: true,
  },
  // 高度变化偏差度
  resizeHeightOffset: {
    type: Number,
    default: 0,
  },
  // 表格内容的横向宽度，如果列被水平固定了，则需要设定它
  scrollX: {
    type: [Number, String],
  },
  // 分页属性
  pagination: {
    type: Object as PropType<PaginationProps>,
  },
  // 每行内操作
  actionColumn: {
    type: Object as PropType<BasicColumn>,
  },
  // 最大高度
  maxHeight: {
    type: Number,
  },
  // 最大高度
  minHeight: {
    type: Number,
    default: 150,
  },
};

// 基础表格
export const useBasicTable = (
  props: ExtractPropTypes<typeof BasicTableProps>,
  emit: (
    event: 'fetch-success' | 'fetch-error' | 'update:checked-row-keys' | 'edit-end' | 'edit-cancel' | 'edit-row-end' | 'edit-change',
    ...args: any[]
  ) => void
) => {
  const tableElRef = ref<Component>();

  // 设置加载状态
  const loadingRef = ref(props.loading);
  watch(
    () => props.loading,
    (loading) => {
      loadingRef.value = loading;
    }
  );
  const getLoading = computed(() => unref(loadingRef));
  const setLoading = (loading: boolean) => {
    loadingRef.value = loading;
  };

  const state = reactive({
    tableSize: props.size || 'medium',
  });

  // 表格工具栏 参数
  const getTableToolbarProps = computed(() => {
    return {
      title: props.title,
      titleTooltip: props.titleTooltip,
    };
  });

  // 处理分页
  const { getPaginationInfo, setPagination } = usePagination(props);

  //获取分页信息
  const pagination = computed(() => toRaw(unref(getPaginationInfo)));

  // 表格处理数据
  const { getDataSourceRef, getRowKey, reload } = useDataSource(props, emit, {
    getPaginationInfo,
    setPagination,
    setLoading,
  });

  const { getPageColumns } = useTableColumns(props);

  // 表格 传入参数
  const deviceHeight = ref(props.maxHeight);
  const geTableBindProps = computed(() => {
    const tableData = unref(getDataSourceRef);
    const maxHeight = tableData.length ? `${unref(deviceHeight)}px` : 'auto';

    return {
      loading: unref(getLoading),
      columns: toRaw(unref(getPageColumns)),
      rowKey: unref(getRowKey),
      data: tableData,
      'max-height': maxHeight,
    };
  });

  //页码切换
  const updatePage = (page: number) => {
    setPagination({ page });
    reload();
  };

  //分页数量切换
  const updatePageSize = (size: number) => {
    setPagination({ size });
    reload();
  };

  // 选中行
  const updateCheckedRowKeys = (rowKeys?: Array<string | number>) => {
    emit('update:checked-row-keys', rowKeys);
  };

  const computeTableHeight = async () => {
    const table = unref(tableElRef);
    if (!table) return;
    if (!props.canResize) return;
    const tableEl = table?.$el;
    const headEl = tableEl.querySelector('.n-data-table-thead');
    const { top, height: headHeight } = useElementBounding(headEl);
    console.log(unref(top), unref(headHeight));
    // console.log(useMainSize, 'useMainSize');

    // const headerH = 64;
    // let paginationH = 2;
    // let marginH = 24;
    // let borderH = 1;
    // if (!isBoolean(pagination)) {
    //   paginationEl = tableEl.querySelector('.n-data-table__pagination') as HTMLElement;
    //   if (paginationEl) {
    //     const offsetHeight = paginationEl.offsetHeight;
    //     paginationH += offsetHeight || 0;
    //   } else {
    //     paginationH += 28;
    //   }
    // }
    let height = useMainSize.height - unref(headHeight);
    const { maxHeight, minHeight } = props;
    if (maxHeight && height > maxHeight) {
      height = maxHeight;
    } else if (height < 0) {
      height = minHeight;
    }
    deviceHeight.value = height;
  };

  return {
    ...toRefs(state),
    getTableToolbarProps,
    tableElRef,
    geTableBindProps,
    pagination,
    getLoading,
    setLoading,
    updatePage,
    updatePageSize,
    updateCheckedRowKeys,
    computeTableHeight,
  };
};
