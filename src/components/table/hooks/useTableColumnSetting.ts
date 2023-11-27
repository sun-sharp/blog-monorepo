import { ExtractPropTypes, reactive, ref, toRefs, unref, watchEffect } from 'vue';
import { BasicColumn, ColumnFixedType, TableColumnKey, TableColumnSettingState } from '/#/components/table';
import { useTableContext } from './useTableContext';
import { cloneDeep } from 'lodash-es';

// 表格设置组件 传参
export const TableColumnSettingProps = {
  // 加载状态
  className: {
    type: String,
    default: '',
  },
  // 固定功能
  tableFixed: {
    type: Boolean,
    default: false,
  },
  // 默认勾选
  hasSelection: {
    type: Boolean,
    default: false,
  },
};

// 表格设置组件
export const useTableColumnSetting = (props: ExtractPropTypes<typeof TableColumnSettingProps>) => {
  const table = useTableContext();
  const columnsList = ref<BasicColumn[]>([]);
  const defaultColumnsList = ref<BasicColumn[]>([]);

  const state = reactive<TableColumnSettingState>({
    selection: props.hasSelection,
    checkAll: true,
    allIndeterminate: false,
    checkKeys: [],
    defaultCheckKeys: [],
  });

  // 初始化
  const init = () => {
    const columns = getDefaultColumns();
    const checkKeys = columns.map((item) => item.key);
    state.checkKeys = checkKeys;
    state.defaultCheckKeys = checkKeys;
    if (columns.length > 0) {
      columnsList.value = cloneDeep(columns);
      defaultColumnsList.value = cloneDeep(columns);
    }
  };

  // 设置
  const setColumns = (columns: BasicColumn[]) => {
    table.setColumns(columns);
  };

  // 获取表格的列
  const getDefaultColumns = () => {
    return cloneDeep(table.getDefaultColumns());
  };

  // 全选
  const onCheckAll = (bool: boolean) => {
    state.allIndeterminate = false;
    if (bool) {
      setColumns(table.getDefaultColumns());
      state.checkKeys = table.getDefaultColumnsKeys();
    } else {
      setColumns([]);
      state.checkKeys = [];
    }
  };

  // 勾选列
  const onSelection = (bool: boolean) => {
    const newColumns = table.getDefaultColumns();
    if (bool) {
      newColumns.unshift({ type: 'selection', key: 'selection' });
      setColumns(newColumns);
    } else {
      const findIndex = newColumns.findIndex((f) => f.type === 'selection' && f.key === 'selection');
      if (~findIndex) {
        newColumns.splice(findIndex, 1);
        setColumns(newColumns);
      }
    }
  };

  // 重置
  const resetColumns = () => {
    state.checkAll = true;
    state.selection = false;
    state.checkKeys = state.defaultCheckKeys;
    state.allIndeterminate = false;
    const newColumns = table.getDefaultColumns();
    // 重置勾选列
    const findIndex = newColumns.findIndex((f) => f.type === 'selection' && f.key === 'selection');
    if (~findIndex) {
      newColumns.splice(findIndex, 1);
    }
    setColumns(newColumns);
  };

  // 列表多选
  const onCheckboxGroupChange = (checkKeys: TableColumnKey[]) => {
    const defaultCols = unref(defaultColumnsList);
    // 处理多选列展示选项
    state.checkAll = defaultCols.length === checkKeys.length;
    state.allIndeterminate = defaultCols.length !== checkKeys.length && checkKeys.length !== 0;
    // 处理表格
    const newColumns: BasicColumn[] = [];
    defaultCols.forEach((f) => {
      if (checkKeys.includes(f.key)) {
        newColumns.push(f);
      }
    });
    setColumns(newColumns);
  };

  // 拖拽排序
  const draggableEnd = () => {
    const newColumns = unref(columnsList);
    setColumns(newColumns);
  };

  const fixedColumn = (item: BasicColumn, fixed: ColumnFixedType) => {
    if (!state.checkKeys.includes(item.key)) return;
    const columns = table.getColumns();
    const isFixed = item.fixed === fixed ? undefined : fixed;
    const index = columns.findIndex((res) => res.key === item.key);
    if (index !== -1) {
      columns[index].fixed = isFixed;
      columnsList.value[index].fixed = isFixed;
      setColumns(columns);
    }
  };

  watchEffect(init);

  return {
    ...toRefs(state),
    columnsList,
    onCheckAll,
    onSelection,
    resetColumns,
    onCheckboxGroupChange,
    draggableEnd,
    fixedColumn,
    // getSelection,
  };
};
