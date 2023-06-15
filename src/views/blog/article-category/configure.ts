import { h } from 'vue';
import { NButton } from 'naive-ui';
import { articleCategoryAPi } from '@/api';

export const useConfigure = ({ loadDataTable }) => {
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
      title: '标识',
      key: 'value',
    },
    {
      title: '名称',
      key: 'name',
    },
    {
      with: 100,
      title: '操作',
      key: 'actions',
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
    },
  ];
  // 删除
  const handleDelete = (row: Recordable) => {
    articleCategoryAPi.remove(row.articleCategoryId).then(() => {
      loadDataTable();
    });
  };

  return {
    searchSchemas,
    columns,
  };
};
