import { computed, ExtractPropTypes, ref, unref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { BasicTableProps } from './useBasicTable';
import { BasicColumn, TableColumnKey } from '/#/components/table';
import { isArray } from '@/utils';

// 表格需要展示的列
export const useTableColumns = (props: ExtractPropTypes<typeof BasicTableProps>) => {
  const selectionColumns: BasicColumn[] = [{ type: 'selection', key: 'selection' }];
  const defaultColumns = props.hasSelection ? selectionColumns.concat(props.columns) : props.columns;
  const columnsRef = ref<BasicColumn[]>(defaultColumns);

  const getPageColumns = computed(() => {
    const pageColumns = unref(columnsRef);
    const columns = cloneDeep(pageColumns);
    return columns;
  });

  // 获取列
  const getColumns = () => unref(columnsRef);

  // 重新设置列
  const setColumns = (columns: BasicColumn[]) => {
    const newColumns = cloneDeep(columns);
    if (!isArray(newColumns)) return;
    if (!newColumns.length) {
      columnsRef.value = [];
      return;
    }
    columnsRef.value = newColumns;
  };

  // 获取缓冲列
  const getDefaultColumns = (): BasicColumn[] => defaultColumns;

  // 获取缓冲列
  const getDefaultColumnsKeys = (): TableColumnKey[] => defaultColumns.map((m) => m.key);

  return {
    getPageColumns,
    getColumns,
    setColumns,
    getDefaultColumns,
    getDefaultColumnsKeys,
  };
};
