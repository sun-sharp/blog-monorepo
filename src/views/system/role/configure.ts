import { h, reactive } from 'vue';
import { TableAction } from '@/components/Table';

export const useConfigure = ({ loadDataTable, addUpdateModelRef, permissionModelRef }) => {
  // 查询配置
  const searchSchemas = [
    {
      field: 'name',
      component: 'NInput',
      label: '姓名',
      componentProps: {
        placeholder: '请输入姓名',
        onInput: (e: any) => {
          console.log(e);
        },
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
  ];

  /**
   * 表格按钮操作配置
   *  */
  // 菜单权限
  const handlePermission = (row: Recordable) => {
    permissionModelRef.value.init(row);
  };
  // 编辑
  const handleEdit = (row: Recordable) => {
    console.log('点击了编辑', row);
    addUpdateModelRef.value.init(row);
  };
  // 删除
  const handleDelete = (row: Recordable) => {
    console.log('点击了删除', row);
    loadDataTable();
  };
  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '菜单权限',
            onClick: handlePermission.bind(null, record),
            ifShow: () => {
              return true;
            },
          },
          {
            label: '删除',
            icon: 'DeleteOutlined',
            type: 'error',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow
            ifShow: () => {
              return true;
            },
          },
          {
            label: '编辑',
            type: 'primary',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
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
