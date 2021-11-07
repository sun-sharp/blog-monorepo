import { h, reactive } from 'vue';
import { TableAction } from '@/components/Table';
import { userApi } from '@/api';
import { NAvatar } from 'naive-ui';
import { getImgUrl } from '@/utils/files/image';

export const useConfigure = ({ reloadTable, addUpdateModelRef }) => {
  // 查询配置
  const searchSchemas = [
    {
      field: 'name',
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
  const columns = [
    {
      title: '昵称',
      key: 'name',
      align: 'center',
    },
    {
      title: '头像',
      key: 'avatar',
      align: 'center',
      render(row) {
        return h(NAvatar, {
          size: 48,
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
      key: 'roleName',
      align: 'center',
    },
  ];

  /**
   * 表格按钮操作配置
   *  */
  // 删除
  const handleDelete = (row: Recordable) => {
    userApi.remove(row.id).then(() => {
      reloadTable();
    });
  };
  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    align: 'center',
    fixed: 'right',
    render(row) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '修改角色',
            type: 'primary',
            onClick: addUpdateModelRef.value.init.bind(null, row),
          },
          {
            label: '删除',
            type: 'error',
            onClick: handleDelete.bind(null, row),
          },
        ],
      });
    },
  });

  return {
    searchSchemas,
    columns,
    actionColumn,
  };
};
