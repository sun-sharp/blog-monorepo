import { h, reactive } from 'vue';
import { NButton } from 'naive-ui';

export const useConfigure = ({ reloadTable }) => {
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
  // 表格字段配置
  const columns = [
    {
      title: '文章标题',
      key: 'title',
    },
    {
      title: '文章简介',
      key: 'brief',
    },
    {
      title: '文章分类名称',
      key: 'categoryName',
    },
    {
      title: '创建时间',
      key: 'createTime',
    },
  ];

  // 操作部分
  const actionColumn = reactive({
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
            type: 'error',
            onClick: handleDelete.bind(null, row),
          },
          {
            default: () => '删除',
          }
        ),
      ];
    },
  });
  // 删除
  const handleDelete = (row: Recordable) => {
    console.log(row, reloadTable);
  };

  return {
    searchSchemas,
    actionColumn,
    columns,
  };
};
