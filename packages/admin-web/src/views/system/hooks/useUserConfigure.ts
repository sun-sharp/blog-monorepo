import { h, ref } from 'vue';
// import TableAction from '@/components/Table/table-action.vue';
import { capitalApi, userApi } from '@/api';
import { NAvatar, NButton, NPopconfirm } from 'naive-ui';
import { getImgUrl } from '@/utils';
import { FormSchema } from '/#/components/form';
import { ApiUserItem, ApiUserSearchParams } from '/#/api/capital/user';
import { BasicColumn, TablePaginationParams } from '/#/components/table';

export const useUserConfigure = () => {
  const addUpdateModelRef = ref<Component>();

  // 查询配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'nickname',
      component: 'NInput',
      label: '昵称',
      componentProps: {
        placeholder: '请输入昵称',
      },
    },
    {
      field: 'username',
      component: 'NInput',
      label: '用户名',
      componentProps: {
        placeholder: '请输入用户名',
      },
    },
  ];

  /**
   * 表格
   *  */
  const actionRef = ref<Component>();
  // 获取接口数据
  const searchParams = ref<ApiUserSearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await userApi.getPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 配置
  const tableRowKey = (row: ApiUserItem): string => row.userId;

  /**
   * 表格按钮操作配置
   *  */
  // 删除
  const handleDelete = (row: ApiUserItem) => {
    capitalApi.removeUser(row.userId).then(() => {
      reloadTable();
    });
  };

  // 表格字段配置
  const columns: BasicColumn<ApiUserItem>[] = [
    {
      title: '昵称',
      key: 'nickname',
      align: 'center',
    },
    {
      title: '头像',
      key: 'avatar',
      align: 'center',
      render(row) {
        return h(NAvatar, {
          size: 48,
          round: true,
          src: typeof row.avatar === 'string' ? getImgUrl(row.avatar) : '',
        });
      },
    },
    {
      title: '用户名',
      key: 'username',
      align: 'center',
    },
    {
      title: '上次登录时间',
      key: 'loginDate',
      align: 'center',
    },
    {
      title: '角色',
      key: 'roleCode',
      align: 'center',
    },
    {
      width: 220,
      title: '操作',
      key: 'action',
      align: 'center',
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
              default: () => '修改角色',
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
  ];

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    reloadTable();
  };

  return {
    addUpdateModelRef,
    searchSchemas,
    actionRef,
    columns,
    tableRowKey,
    searchSubmit,
    loadDataTable,
    reloadTable,
  };
};
