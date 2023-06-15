import { h, reactive } from 'vue';
import { NButton } from 'naive-ui';
import { articleAPi } from '@/api';

export const useConfigure = ({ reloadTable, emit }) => {
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
            type: 'primary',
            onClick: handleEdit.bind(null, row),
          },
          {
            default: () => '编辑',
          }
        ),
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
  // 编辑
  const handleEdit = (row: Recordable) => {
    emit('editChange', row);
  };
  // 删除
  const handleDelete = (row: Recordable) => {
    articleAPi.remove(row.articleId).then(() => {
      reloadTable();
    });
  };

  return {
    actionColumn,
    columns,
  };
};
