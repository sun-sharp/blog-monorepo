import { computed, ExtractPropTypes } from 'vue';
import { cloneDeep } from 'lodash-es';
import { BasicTableProps } from './useBasicTable';

export const useTableColumns = (props: ExtractPropTypes<typeof BasicTableProps>) => {
  const getPageColumns = computed(() => {
    const { columns } = props;
    const pageColumns = cloneDeep(columns);
    return pageColumns;
  });

  return {
    getPageColumns,
  };
};
