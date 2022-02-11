import { h, reactive } from 'vue';
import { TableAction } from '@/components/Table';
import { roleTypeObj } from '@/constant';
import { roleApi } from '@/api';

export const useConfigure = ({ reloadTable, addUpdateModelRef }) => {
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

  // 表格字段配置
  const columns = [
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
  ];

  /**
   * 表格按钮操作配置
   *  */
  // 删除
  const handleDelete = (row: Recordable) => {
    roleApi.remove(row.id).then(() => {
      reloadTable();
    });
  };
  const actionColumn = reactive({
    width: 200,
    title: '操作',
    key: 'action',
    align: 'center',
    fixed: 'right',
    render(row) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '编辑',
            type: 'primary',
            onClick: addUpdateModelRef.value.init.bind(null, row),
            // ifShow: () => {
            //   return row.roleCode === 'manager' ? false : true;
            // },
          },
          {
            label: '删除',
            type: 'error',
            onClick: handleDelete.bind(null, row),
            // 根据业务控制是否显示 isShow
            // ifShow: () => {
            //   return row.roleCode === 'manager' ? false : true;
            // },
          },
        ],
        // 更多
        /* dropDownActions: [
          {
            label: '启用',
            key: 'enabled',
            // 根据业务控制是否显示: 非enable状态的不显示启用按钮
            ifShow: () => {
              return true;
            },
          },
          {
            label: '禁用',
            key: 'disabled',
            ifShow: () => {
              return true;
            },
          },
        ],
        select: (key) => {
          message.info(`您点击了，${key} 按钮`);
        }, */
      });
    },
  });

  return {
    searchSchemas,
    columns,
    actionColumn,
  };
};
