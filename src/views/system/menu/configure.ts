import { h } from 'vue';
import { constantHtmlIcon } from '@/utils/icons';
import { NButton, NTag } from 'naive-ui';
import { menuTypeObj } from '@/enums';
import { menuApi } from '@/api';

export const useConfigure = ({ loadDataTable, addUpdateModelRef }) => {
  // 查询配置
  const searchSchemas = [
    {
      field: 'title',
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
    1: 'info',
    2: 'info',
    5: 'success',
    6: 'warning',
    7: 'error',
  };
  // 表格字段配置
  const columns = [
    {
      with: 200,
      title: '名称',
      key: 'title',
    },
    {
      title: '上级菜单',
      key: 'parentName',
    },
    {
      title: '路由',
      key: 'path',
    },
    {
      title: '标识',
      align: 'center',
      render(row) {
        return row.menuType === 7 ? '' : row.name;
      },
    },
    {
      title: '图标',
      align: 'center',
      key: 'icon',
      render(row) {
        return constantHtmlIcon[row.icon];
      },
    },
    {
      title: '类型',
      align: 'center',
      render(row) {
        return h(
          NTag,
          {
            type: typeNameObj[row.menuType],
          },
          {
            default: () => menuTypeObj[row.menuType],
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
      render(row) {
        let menuUrl = row.component;
        if (row.menuType === 6) {
          menuUrl = row.iframeSrc;
        }
        if (row.menuType === 7) {
          menuUrl = row.name;
        }
        return menuUrl;
      },
    },
    {
      title: '是否隐藏',
      align: 'center',
      render(row) {
        return row.hidden ? '是' : '否';
      },
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
              type: 'primary',
              onClick: addUpdateModelRef.value.init.bind(null, row),
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
    },
  ];
  // 删除
  const handleDelete = (row: Recordable) => {
    menuApi.removeMenu(row.id).then(() => {
      loadDataTable();
    });
  };

  return {
    searchSchemas,
    columns,
  };
};
