import { h } from 'vue';
import { constantRouterIcon } from '@/router/router-icons';
import { NButton, NTag } from 'naive-ui';

export const useConfigure = ({ message, loadDataTable, showModal }) => {
  // 查询配置
  const searchSchemas = [
    {
      field: 'name',
      component: 'NInput',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
      },
    },
  ];

  /**
   * 表格按钮操作配置
   *  */
  const typeNameObj = {
    外链: 'error',
    内嵌: 'warning',
    目录: 'info',
    菜单: 'success',
  };
  // 表格字段配置
  const columns = [
    {
      with: '100px',
      title: '名称',
      key: 'title',
    },
    {
      title: '上级菜单',
      key: 'parentName',
    },
    {
      title: '图标',
      align: 'center',
      key: 'icon',
      render(row) {
        return constantRouterIcon[row.icon]();
      },
    },
    {
      title: '类型',
      align: 'center',
      render(row) {
        return h(
          NTag,
          {
            type: typeNameObj[row.typeName],
          },
          {
            default: () => row.typeName,
          }
        );
      },
    },
    {
      title: '排序号',
      align: 'center',
      key: 'sort',
    },
    {
      title: '菜单URL',
      align: 'center',
      key: 'menuUrl',
    },
    {
      title: '菜单是否隐藏',
      align: 'center',
      key: 'hidden',
      render(row) {
        return row.hidden ? '是' : '否';
      },
    },
    {
      with: '100px',
      title: '操作',
      key: 'actions',
      align: 'center',
      render(row) {
        return [
          h(
            NButton,
            {
              class: 'mh-3',
              text: true,
              type: 'primary',
              onClick: handleEdit.bind(null, row),
            },
            {
              default: () => '编辑',
            }
          ),
          row.typeName !== '目录'
            ? h(
                NButton,
                {
                  class: 'mh-3',
                  text: true,
                  type: 'error',
                  onClick: handleDelete.bind(null, row),
                },
                {
                  default: () => '删除',
                }
              )
            : '',
        ];
      },
    },
  ];
  // 编辑
  const handleEdit = (record: Recordable) => {
    console.log('点击了编辑', record);
    showModal.value = true;
  };
  // 删除
  const handleDelete = (record: Recordable) => {
    console.log('点击了删除', record);
    message.info('点击了删除');
    loadDataTable();
  };

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
    modelSchemas,
  };
};
