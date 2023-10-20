import { h, ref } from 'vue';
import { roleTypeObj } from '@/constant';
import { roleApi } from '@/api';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { ApiRoleItem, ApiRoleSearchParams } from '/#/api/role';
import { NButton, NPopconfirm } from 'naive-ui';

export const useRoleConfigure = () => {
  const addUpdateModelRef = ref<Component>();

  // 查询配置
  const searchSchemas = [
    {
      field: 'name',
      component: 'NInput',
      label: '角色名称',
      componentProps: {
        placeholder: '请输入角色名称',
      },
    },
    {
      field: 'roleCode',
      component: 'NInput',
      label: '角色标识',
      componentProps: {
        placeholder: '请输入角色标识',
      },
    },
  ];

  // 删除
  const handleDelete = (row: ApiRoleItem) => {
    roleApi.remove(row.roleId).then(() => {
      reloadTable();
    });
  };

  // 表格字段配置
  const columns: BasicColumn<ApiRoleItem>[] = [
    {
      title: '角色名称',
      key: 'name',
      align: 'center',
    },
    {
      title: '角色标识',
      key: 'roleCode',
      align: 'center',
    },
    {
      title: '角色权限类型',
      key: 'roleType',
      align: 'center',
      render(row) {
        return roleTypeObj[row.roleType];
      },
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
  ];

  /**
   * 表格按钮操作配置
   *  */

  // const actionColumn = reactive({
  //   width: 200,
  //   title: '操作',
  //   key: 'action',
  //   align: 'center',
  //   fixed: 'right',
  //   render(row) {
  //     return h(TableAction as any, {
  //       style: 'button',
  //       actions: [
  //         {
  //           label: '编辑',
  //           type: 'primary',
  //           onClick: addUpdateModelRef.value.init.bind(null, row),
  //           // ifShow: () => {
  //           //   return row.roleCode === 'manager' ? false : true;
  //           // },
  //         },
  //         {
  //           label: '删除',
  //           type: 'error',
  //           onClick: handleDelete.bind(null, row),
  //           // 根据业务控制是否显示 isShow
  //           // ifShow: () => {
  //           //   return row.roleCode === 'manager' ? false : true;
  //           // },
  //         },
  //       ],
  //       // 更多
  //       /* dropDownActions: [
  //         {
  //           label: '启用',
  //           key: 'enabled',
  //           // 根据业务控制是否显示: 非enable状态的不显示启用按钮
  //           ifShow: () => {
  //             return true;
  //           },
  //         },
  //         {
  //           label: '禁用',
  //           key: 'disabled',
  //           ifShow: () => {
  //             return true;
  //           },
  //         },
  //       ],
  //       select: (key) => {
  //         message.info(`您点击了，${key} 按钮`);
  //       }, */
  //     });
  //   },
  // });

  /**
   * 表格
   *  */
  const actionRef = ref();
  // 获取接口数据
  const searchParams = ref<ApiRoleSearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await roleApi.getPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 配置
  const tableRowKey = (row: ApiRoleItem): string => row.roleId;

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
    searchSubmit,
    loadDataTable,
    reloadTable,
    tableRowKey,
  };
};
