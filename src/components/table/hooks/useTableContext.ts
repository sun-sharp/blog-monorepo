import { provide, inject } from 'vue';
import { TableContextInstance } from '/#/components/table';

const key = Symbol('basic-table');

// 注入表格数据
export const createTableContext = (instance: TableContextInstance) => {
  provide(key, instance);
};

// 获取注入的数据
export const useTableContext = () => {
  return inject(key) as TableContextInstance;
};
