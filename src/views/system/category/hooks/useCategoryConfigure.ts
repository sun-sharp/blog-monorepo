import { computed, h, ref } from 'vue';
import { FormSchema } from '/#/components/form';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { categoryApi } from '@/api';
import { ApiCategoryItem, ApiCategorySearchParams } from '/#/api/category';
import { NButton } from 'naive-ui';
// import TableAction from '@/components/Table/table-action.vue';

export const useCategoryConfigure = () => {
  // 查询配置
  const searchSchemas = computed<FormSchema[]>(() => [
    {
      field: 'type',
      component: 'NInput',
      label: '全局类型分类',
      labelWidth: 110,
      componentProps: {
        placeholder: '请输入全局类型分类',
      },
    },
  ]);

  const categoryAddUpdateRef = ref<Component>();

  const actionRef = ref();

  /**
   * 表格
   *  */
  // 获取接口数据
  const searchParams = ref<ApiCategorySearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await categoryApi.getPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 表格字段配置
  const columns = computed<BasicColumn<ApiCategoryItem>[]>(() => [
    {
      title: '全局类型分类',
      key: 'type',
      align: 'center',
      width: 170,
    },
    {
      title: '全局类型标识',
      key: 'value',
      align: 'center',
    },
    {
      title: '全局类型标识（字符串类型）',
      key: 'valueStr',
      align: 'center',
    },
    {
      title: '全局类型名称',
      key: 'label',
      align: 'center',
    },
    {
      width: 150,
      title: '操作',
      key: 'action',
      align: 'center',
      render(row) {
        return row.categoryId
          ? h(
              NButton,
              {
                type: 'primary',
                text: true,
                onClick: categoryAddUpdateRef.value.init.bind(null, row),
              },
              {
                default: () => '修改',
              }
            )
          : '';
      },
    },
  ]);

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    actionRef.value.updatePage(1);
  };

  return { categoryAddUpdateRef, actionRef, searchSchemas, columns, loadDataTable, reloadTable, searchSubmit };
};
