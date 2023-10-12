// import { useSetting } from '@/hooks';
// import { computed, reactive, ref, toRaw, toRefs, unref, watchEffect } from 'vue';
// import { useTableContext } from './useTableContext';
// import { cloneDeep } from 'lodash-es';
// import { BasicColumn, ColumnFixedType, TableColumnSettingState } from '/#/components/table';

// 表格设置组件
export const useTableColumnSetting = () => {
  // const { getAppTheme } = useSetting();
  // const table = useTableContext();
  // const columnsList = ref<BasicColumn[]>([]);
  // const cacheColumnsList = ref<BasicColumn[]>([]);

  // const state = reactive<TableColumnSettingState>({
  //   selection: false,
  //   checkAll: true,
  //   checkList: [],
  //   defaultCheckList: [],
  // });

  // const getSelection = computed(() => {
  //   return state.selection;
  // });

  // watchEffect(() => {
  //   const columns = table.getColumns();
  //   if (columns.length) {
  //     init();
  //   }
  // });

  //初始化
  // const init = () => {
  //   const columns = getColumns();
  //   const checkList = columns.map((item) => item.key);
  //   state.checkList = checkList;
  //   state.defaultCheckList = checkList;
  //   const newColumns = columns.filter((item) => item.key != 'action' && item.title != '操作');
  //   if (!columnsList.value.length) {
  //     columnsList.value = cloneDeep(newColumns);
  //     cacheColumnsList.value = cloneDeep(newColumns);
  //   }
  // };

  // //切换
  // const onChange = (checkList: string[]) => {
  //   if (state.selection) {
  //     checkList.unshift('selection');
  //   }
  //   // setColumns(checkList);
  // };

  //设置
  // const setColumns = (columns: BasicColumn[]) => {
  //   table.setColumns(columns);
  // };

  // //获取
  // const getColumns = () => {
  //   const newRet: BasicColumn[] = [];
  //   table.getColumns().forEach((item) => {
  //     newRet.push({ ...item });
  //   });
  //   return newRet;
  // };

  // 重置
  // const resetColumns = () => {
  //   state.checkList = [...state.defaultCheckList];
  //   state.checkAll = true;
  //   const cacheColumnsKeys = table.getCacheColumns();
  //   const newColumns = cacheColumnsKeys.map((item) => {
  //     return {
  //       ...item,
  //       fixed: undefined,
  //     };
  //   });
  //   setColumns(newColumns);
  //   columnsList.value = newColumns;
  // };

  //全选
  // const onCheckAll = (bool: boolean) => {
  //   const checkList = table.getCacheColumnsKeys();
  //   if (bool) {
  //     // setColumns(checkList);
  //     state.checkList = checkList;
  //   } else {
  //     setColumns([]);
  //     state.checkList = [];
  //   }
  // };

  //拖拽排序
  // const draggableEnd = () => {
  //   const newColumns = toRaw(unref(columnsList));
  //   columnsList.value = newColumns;
  //   setColumns(newColumns);
  // };

  // 勾选列
  // const onSelection = (bool: boolean) => {
  //   // const checkList = table.getCacheColumns();
  //   if (bool) {
  //     //   checkList.unshift('selection');
  //     //   setColumns(checkList);
  //     // } else {
  //     //   checkList.splice(0, 1);
  //     //   setColumns(checkList);
  //   }
  // };

  // 固定
  // const fixedColumn = (item: { key: string; fixed: ColumnFixedType }, fixed: ColumnFixedType) => {
  //   if (!state.checkList.includes(item.key)) return;
  //   const columns = getColumns();
  //   const isFixed = item.fixed === fixed ? undefined : fixed;
  //   console.log(isFixed);
  //   const index = columns.findIndex((res) => res.key === item.key);
  //   if (index !== -1) {
  //     // columns[index].fixed = isFixed;
  //   }
  //   // table.setCacheColumnsField(item.key, { fixed: isFixed });
  //   // columnsList.value[index].fixed = isFixed;
  //   setColumns(columns);
  // };

  return {
    // ...toRefs(state),
    // columnsList,
    // getAppTheme,
    // onChange,
    // onCheckAll,
    // onSelection,
    // resetColumns,
    // fixedColumn,
    // draggableEnd,
    // getSelection,
  };
};
