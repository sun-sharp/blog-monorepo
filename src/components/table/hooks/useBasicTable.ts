import { useDataSource } from './useDataSource';
import { usePagination } from './usePagination';
import { useTableColumns } from './useTableColumns';
import { BasicColumn, TablePaginationParams, PaginationProps, TableSizeType, TablePaginationResult, PaginationConfig } from '/#/components/table';
import { ExtractPropTypes, computed, nextTick, onMounted, reactive, ref, toRefs, unref, watch } from 'vue';
import { PAGE_FIELD, SIZE_FIELD } from '@/constant';
import { getBoundingClientRect, isBoolean } from '@/utils';
import { useLayoutSizeSetting, useContSize, useSetting } from '@/hooks';
import { useDebounceFn } from '@vueuse/core';
import { createTableContext } from './useTableContext';

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
    type: Function as PropType<(params: TablePaginationParams) => Promise<TablePaginationResult<any[]>>>,
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
    type: Object as PropType<PaginationProps | Boolean>,
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
  },
  // 是否是n-card包括的
  isCardSurround: {
    type: Boolean,
    default: false,
  },
  cardSurroundPaddingBottom: {
    type: Number,
    default: 20,
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

  // 表格固定功能
  const columnSettingFixed = ref<boolean>(false);

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
  const pagination = computed(() => {
    return unref(getPaginationInfo);
  });

  // 表格处理数据
  const { getDataSourceRef, getRowKey, reload } = useDataSource(props, emit, {
    getPaginationInfo,
    setPagination,
    setLoading,
  });

  const { getPageColumns, getColumns, setColumns, getDefaultColumns, getDefaultColumnsKeys } = useTableColumns(props);

  // 表格 传入参数
  const deviceHeight = ref(props.maxHeight);
  const geTableBindProps = computed(() => {
    const tableData = unref(getDataSourceRef);
    const devH = unref(deviceHeight);
    const maxHeight = tableData.length && devH ? `${devH}px` : 'auto';
    const { scrollX } = props;

    return {
      loading: unref(getLoading),
      columns: unref(getPageColumns),
      rowKey: unref(getRowKey),
      data: tableData,
      remote: true, // 表格是否自动分页数据，在异步的状况下你可能需要把它设为 true
      maxHeight,
      scrollX,
      columnSettingFixed: unref(columnSettingFixed),
    };
  });

  //页码切换
  const updatePage = (page: number) => {
    const params: PaginationConfig = {};
    params[PAGE_FIELD] = page;
    setPagination(params);
    reload();
  };

  //分页数量切换
  const updatePageSize = (pageSize: number) => {
    const params: PaginationConfig = {};
    params[PAGE_FIELD] = 1;
    params[SIZE_FIELD] = pageSize;
    setPagination(params);
    reload();
  };

  // 选中行
  const updateCheckedRowKeys = (rowKeys?: Array<string | number>) => {
    emit('update:checked-row-keys', rowKeys);
  };

  // layout的高度和宽度
  const { headerHeight, tabsViewHeight, footerHeight } = useLayoutSizeSetting();

  const { getHeadFixed, getTabsViewShow, getTabsViewFixed, getFooterShow, getFooterFixed } = useSetting();

  // 设置表格那内容滚动高度
  const computeTableHeight = async () => {
    const table = unref(tableElRef);
    if (!table) return;
    if (!props.canResize) return;
    const tableEl = table?.$el;
    const tableHeadEl = tableEl.querySelector('.n-data-table-thead');
    const tableHeadClientRect = getBoundingClientRect(tableHeadEl);
    if (!tableHeadClientRect) return;

    // 获取表格头部离页面顶部的距离 top，表格头部的高度
    const { top: tableHeadTop, height: tableHeadHeight } = tableHeadClientRect;

    // 获取layout顶栏高度
    let headerH = 0;
    if (unref(getHeadFixed)) {
      headerH += unref(headerHeight);
    }
    if (unref(getTabsViewShow) && unref(getTabsViewFixed)) {
      headerH += unref(tabsViewHeight);
    }
    const footerH = unref(footerHeight);

    // 获取分页的高度
    let paginationH = 0;
    const paginationMarginTop = 12;
    if (!isBoolean(pagination)) {
      const paginationEl = tableEl.querySelector('.n-data-table__pagination');
      const pageClientRect = getBoundingClientRect(paginationEl);
      if (pageClientRect) {
        const { height: pageHeight } = pageClientRect;
        paginationH = pageHeight + paginationMarginTop;
      }
    }

    // 其它相关高度
    const tableHeadBorderBottom = 1;
    const contPaddingBottom = 10;

    /** 高度设置为 lnf-cont 的高度
        - 内容里表格以上的高度（表格头部离页面顶部的距离 top - 获取layout顶栏高度 - 设置的向上内边距）
        - 表格表头的高度
        - 分页的高度
        - 表格表头和滚动内容直接的边框
        - card卡片以下的内边距
        - 内容设置的内边距
      */
    let height = useContSize.height - (tableHeadTop - headerH) - tableHeadHeight - paginationH - tableHeadBorderBottom - contPaddingBottom;

    // 减去外部card包括的底部内边距
    const cardPaddingBottom = props.cardSurroundPaddingBottom;
    if (props.isCardSurround) {
      height -= cardPaddingBottom;
    }

    // 固定底部后，再减去layout底部高度
    if (!unref(getFooterFixed)) {
      height -= footerH;
    }

    const { maxHeight, minHeight } = props;
    if (maxHeight && height > maxHeight) {
      height = maxHeight;
    } else if (height < 0) {
      height = minHeight ? minHeight : 0;
    }
    deviceHeight.value = height;
  };

  const debounceTableHeight = useDebounceFn(computeTableHeight, 150);

  // 监听内容展示的模块高度变化
  watch(
    () => [useContSize.height, getTabsViewShow, getFooterShow],
    () => {
      debounceTableHeight();
    },
    { deep: true }
  );

  onMounted(() => {
    nextTick(() => {
      debounceTableHeight();
    });
  });

  // 创建表格配置
  createTableContext({ getColumns, setColumns, getDefaultColumns, getDefaultColumnsKeys });

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
    reload,
    debounceTableHeight,
  };
};
