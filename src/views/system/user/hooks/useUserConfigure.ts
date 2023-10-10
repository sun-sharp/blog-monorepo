import { h, reactive, ref } from 'vue';
// import TableAction from '@/components/Table/table-action.vue';
import { userApi } from '@/api';
import { NAvatar } from 'naive-ui';
import { getImgUrl } from '@/utils';
import { FormSchema } from '/#/components/form';
import { ApiUserItem } from '/#/api/user';
import { BasicColumn } from '/#/components/table';

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

  // 表格字段配置
  const columns: BasicColumn[] = [
    {
      title: '昵称',
      key: 'nickname',
      align: 'center',
    },
    {
      title: '头像',
      key: 'avatar',
      align: 'center',
      render(row: ApiUserItem) {
        return h(NAvatar, {
          size: 48,
          round: true,
          src: getImgUrl(row.avatar),
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
  ];

  /**
   * 表格
   *  */
  // const actionRef = ref();
  // 获取接口数据
  const searchParams = ref({});
  const loadDataTable = async () => {
    return await userApi.getPage({
      nickname: '',
      username: '',
      size: 0,
      current: 0,
    });
  };
  // 刷新数据
  // const reloadTable = () => {
  //   actionRef.value.reload();
  // };
  // 配置
  const tableRowKey = (row: ApiUserItem): string => row.userId;

  /**
   * 表格按钮操作配置
   *  */
  // 删除
  // const handleDelete = (row: Recordable) => {
  //   capitalApi.removeUser(row.userId).then(() => {
  //     reloadTable();
  //   });
  // };

  const actionColumn = reactive({});

  // const actionColumn = reactive({
  //   width: 220,
  //   title: '操作',
  //   key: 'action',
  //   align: 'center',
  //   fixed: 'right',
  //   render(row) {
  //     return h(TableAction as any, {
  //       style: 'button',
  //       actions: [
  //         {
  //           label: '修改角色',
  //           type: 'primary',
  //           onClick: addUpdateModelRef.value.init.bind(null, row),
  //         },
  //         {
  //           label: '删除',
  //           type: 'error',
  //           onClick: handleDelete.bind(null, row),
  //         },
  //       ],
  //     });
  //   },
  // });

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    // reloadTable();
  };

  return {
    addUpdateModelRef,
    searchSchemas,
    columns,
    actionColumn,
    tableRowKey,
    searchSubmit,
    loadDataTable,
  };
};
