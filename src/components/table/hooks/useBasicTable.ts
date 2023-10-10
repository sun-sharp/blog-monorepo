import { BasicColumn } from '/#/components/table';
import { ExtractPropTypes, ref } from 'vue';
import { useLoading } from './useLoading';

// 基础表格 传参
export const BasicTableProps = {
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
  titleTooltip: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: 'medium',
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: [Array] as PropType<BasicColumn[]>,
    default: () => [],
    required: true,
  },
  // request: {
  //   type: Function as PropType<(...arg: any[]) => Promise<any>>,
  //   default: null,
  //   required: true,
  // },
  rowKey: {
    type: [String, Function] as PropType<string | ((record: any) => string)>,
    default: undefined,
  },
  //废弃
  showPagination: {
    type: [String, Boolean],
    default: 'auto',
  },
  actionColumn: {
    type: Object as PropType<BasicColumn>,
    default: null,
  },
  canResize: {
    type: Boolean,
    default: true,
  },
  resizeHeightOffset: {
    type: Number,
    default: 0,
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

  const { getLoading, setLoading } = useLoading(props);

  // 选中行
  const updateCheckedRowKeys = (rowKeys?: Array<string | number>) => {
    emit('update:checked-row-keys', rowKeys);
  };

  return {
    tableElRef,
    getLoading,
    setLoading,
    updateCheckedRowKeys,
  };
};
