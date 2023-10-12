import { ExtractPropTypes, ref } from 'vue';
import { TableSizeType } from '/#/components/table';

// 表格工具栏 传参
export const TableToolbarProps = {
  title: {
    type: String,
  },
  titleTooltip: {
    type: String,
  },
  size: {
    type: String as PropType<TableSizeType>,
    default: 'medium',
  },
  hasColumnSetting: {
    type: Boolean,
    default: false,
  },
};

// 表格工具栏
export const useTableToolbar = (props: ExtractPropTypes<typeof TableToolbarProps>, emit: (event: 'update:size', ...args: any[]) => void) => {
  const tableSize = ref(props.size);

  //密度切换
  const densitySelect = (size: TableSizeType) => {
    tableSize.value = size;
    emit('update:size', size);
  };

  return {
    tableSize,
    densitySelect,
  };
};
