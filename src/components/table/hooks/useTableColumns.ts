import { computed, ExtractPropTypes, ref, unref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { BasicTableProps } from './useBasicTable';
import { BasicColumn } from '/#/components/table';
import { ColumnKey } from 'naive-ui/es/data-table/src/interface';
import { isArray } from '@/utils';

// 表格需要展示的列
export const useTableColumns = (props: ExtractPropTypes<typeof BasicTableProps>) => {
  const columnsRef = ref<BasicColumn[]>(props.columns);
  const defaultColumns = props.columns;

  const getPageColumns = computed(() => {
    const pageColumns = unref(columnsRef);
    const columns = cloneDeep(pageColumns);
    return columns;
  });

  // 获取列
  const getColumns = () => {
    const columns = unref(columnsRef);
    return columns.map((item) => {
      return { ...item, title: item.title, key: item.key, fixed: item.fixed };
    });
  };

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
  const getDefaultColumnsKeys = (): ColumnKey[] => defaultColumns.map((m) => m.key);

  return {
    getPageColumns,
    getColumns,
    setColumns,
    getDefaultColumns,
    getDefaultColumnsKeys,
  };
};
