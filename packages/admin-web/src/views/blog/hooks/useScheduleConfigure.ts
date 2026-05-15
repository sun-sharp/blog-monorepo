import { computed, h, onActivated, onMounted, ref } from 'vue';
import { ApiScheduleItem, ApiScheduleSearchParams } from '/#/api/blog/schedule';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { scheduleAPi } from '@/api';
import { FormSchema } from '/#/components/form';
import { NButton, NPopconfirm } from 'naive-ui';

// 文章管理
export const useConfigure = () => {
  // const nMessage = useMessage();

  // 新增弹窗
  const addUpdateModelRef = ref<Component>();

  /**
   * 表格
   *  */
  const actionRef = ref<Component>();
  // 获取接口数据
  const searchParams = ref<ApiScheduleSearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await scheduleAPi.getFindPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 表格key配置
  const tableRowKey = (row: ApiScheduleItem): string => row.scheduleId;
  // 配置
  // 查询配置
  const searchSchemas = computed<FormSchema[]>(() => [
    {
      field: 'keywords',
      component: 'NInput',
      label: '关键字',
      componentProps: {
        placeholder: '请输入关键字',
      },
    },
  ]);

  // 删除
  const handleDelete = (row: Recordable) => {
    scheduleAPi.remove(row.scheduleId).then(() => {
      reloadTable();
    });
  };

  const columns = computed<BasicColumn<ApiScheduleItem>[]>(() => [
    {
      title: '标题',
      key: 'title',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '内容',
      key: 'content',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '开始日期',
      key: 'startDate',
    },
    {
      title: '结束日期',
      key: 'endDate',
    },
    {
      title: '开始时间',
      key: 'startTime',
    },
    {
      title: '结束时间',
      key: 'endTime',
    },
    {
      width: 200,
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render(row) {
        return [
          h(
            NButton,
            {
              class: 'mh-3',
              text: true,
              type: 'primary',
              onClick: addUpdateModelRef.value.init.bind(null, row),
            },
            {
              default: () => '编辑',
            }
          ),
          h(
            NPopconfirm,
            {
              negativeText: null,
              onPositiveClick: handleDelete.bind(null, row),
            },
            {
              trigger: () =>
                h(
                  NButton,
                  {
                    class: 'mh-3',
                    text: true,
                    type: 'error',
                  },
                  {
                    default: () => '删除',
                  }
                ),
              default: () => '是否确定删除',
            }
          ),
        ];
      },
    },
  ]);

  /**
   * 查询
   *  */
  // 数据查询
  const searchSubmit = (values: ApiScheduleSearchParams) => {
    searchParams.value = {
      ...values,
    };
    actionRef.value.updatePage(1);
    actionRef.value.updateCheckedRowKeys();
  };

  // 列表选中
  const checkedRowKeys = ref<string[]>([]);
  const checkedRowKeysDisabled = computed(() => checkedRowKeys.value.length === 0);
  const tableCheckedRowKeys = (rowKeys?: string[]) => {
    checkedRowKeys.value = rowKeys ? rowKeys : [];
  };

  // 初始化
  const init = () => {};

  onActivated(init);
  onMounted(init);

  return {
    actionRef,
    addUpdateModelRef,
    searchSchemas,
    columns,
    checkedRowKeysDisabled,
    searchSubmit,
    loadDataTable,
    tableRowKey,
    reloadTable,
    tableCheckedRowKeys,
  };
};
