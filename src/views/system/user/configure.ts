import { h, reactive } from 'vue';
import { NAvatar } from 'naive-ui';
import { TableAction } from '@/components/Table';

export const useConfigure = ({ message }) => {
  // 查询配置
  const searchSchemas = [
    {
      field: 'name',
      component: 'NInput',
      label: '姓名',
      componentProps: {
        placeholder: '请输入姓名',
      },
    },
  ];

  // 表格字段配置
  const columns = [
    {
      title: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
    },
    {
      title: '名称',
      key: 'name',
      width: 100,
    },
    {
      title: '头像',
      key: 'avatar',
      width: 100,
      render(row) {
        return h(NAvatar, {
          size: 48,
          src: row.avatar,
        });
      },
    },
    {
      title: '地址',
      key: 'address',
      auth: ['basic_list'], // 同时根据权限控制是否显示
      // _column
      ifShow: () => {
        return true; // 根据业务控制是否显示
      },
      width: 150,
    },
    {
      title: '开始日期',
      key: 'beginTime',
      width: 160,
    },
    {
      title: '结束日期',
      key: 'endTime',
      width: 160,
    },
    {
      title: '创建时间',
      key: 'date',
      width: 100,
    },
  ];

  /**
   * 表格按钮操作配置
   *  */
  // 编辑
  const handleEdit = (record: Recordable) => {
    console.log('点击了编辑', record);
  };
  // 删除
  const handleDelete = (record: Recordable) => {
    console.log('点击了删除', record);
    message.info('点击了删除');
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
            label: '删除',
            icon: 'DeleteOutlined',
            type: 'error',
            // color: '#8a2be2',
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
        dropDownActions: [
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
        },
      });
    },
  });
  /**
   * 弹窗配置
   * */
  const modelSchemas = [
    {
      field: 'name',
      component: 'NInput',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  return {
    searchSchemas,
    columns,
    actionColumn,
    modelSchemas,
  };
};
