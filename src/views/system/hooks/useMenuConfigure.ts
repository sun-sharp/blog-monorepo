import { h, nextTick, onMounted, reactive, ref } from 'vue';
import { constantHtmlIcon, levelMenu } from '@/utils';
import { DataTableColumns, NButton, NPopconfirm, NTag } from 'naive-ui';
import { MAIN_DIRECTORY_VALUE, menuTagTypeNameObj, menuTypeObj } from '@/constant';
import { menuApi } from '@/api';
import { ApiLevelMenuItem } from '/#/api/menu';
import { FormSchema } from '/#/components/form';
import { TableSizeType } from '/#/components/table';
import at from 'await-to-js';

interface ISearchParams {
  title: string;
}

/**
 * @description: 根据参数过滤表单数据
 */
const filterMenuByParams = (arr: ApiLevelMenuItem[], params: ISearchParams) => {
  if (!params.title) return arr;
  const newArr: ApiLevelMenuItem[] = [];
  arr.forEach((m) => {
    const item = { ...m };
    if (m.title.indexOf(params.title) !== -1) {
      newArr.push(m);
      return true;
    } else if (m.children && m.children.length > 0) {
      item.children = filterMenuByParams(m.children, params);
      if (item.children && item.children.length > 0) newArr.push(m);
    }
  });
  return newArr;
};

export const useMenuConfigure = () => {
  const addUpdateModelRef = ref<Component>();

  // 配置表格密度
  const tableSize = ref<TableSizeType>('medium');

  // 表格
  const tableData = ref<ApiLevelMenuItem[]>([]);
  const tableTempData = ref<ApiLevelMenuItem[]>([]);

  // 表格加载
  const tableLoading = ref(false);

  // 表格展开值
  const expandedRowKeys = ref<Array<string | number>>([]);

  /**
   * 表格
   *  */
  // 获取接口数据
  const loadDataTable = async () => {
    tableLoading.value = true;
    const [err, res] = await at(menuApi.getMenuList());
    if (err || !res) return;
    expandedRowKeys.value = res.filter((f) => f.menuType === MAIN_DIRECTORY_VALUE).map((m) => m.name);
    const levelData = levelMenu(res);
    tableTempData.value = levelData;
    tableData.value = levelData;
    tableLoading.value = false;
  };

  // 查询配置
  const searchSchemas: FormSchema[] = [
    {
      field: 'title',
      component: 'NInput',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
      },
    },
  ];

  // 表格字段配置
  const columns: DataTableColumns<ApiLevelMenuItem> = [
    {
      minWidth: 200,
      title: '名称',
      key: 'title',
    },
    {
      title: '标识',
      key: 'name',
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
        return row.icon ? constantHtmlIcon[row.icon] : '';
      },
    },
    {
      title: '类型',
      key: 'menuType',
      align: 'center',
      render(row) {
        return h(
          NTag as Component,
          {
            type: menuTagTypeNameObj[row.menuType],
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
      key: 'component',
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
      key: 'hidden',
      align: 'center',
      render(row) {
        return row.hidden ? '是' : '否';
      },
    },
    {
      title: '是否缓存',
      key: 'keepAlive',
      align: 'center',
      render(row) {
        return typeof row.keepAlive === 'boolean' ? (row.keepAlive ? '是' : '否') : '';
      },
    },
    {
      minWidth: 100,
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

  // 删除
  const handleDelete = (row: ApiLevelMenuItem) => {
    menuApi.removeMenu(row.menuId).then(() => {
      loadDataTable();
    });
  };

  /**
   * 查询
   *  */
  const searchParams = reactive<ISearchParams>({
    title: '',
  });
  // 数据查询
  const searchSubmit = (values: ISearchParams) => {
    searchParams.title = values.title;
    tableData.value = filterMenuByParams(tableTempData.value, values);
  };

  // 刷新
  const reload = async () => {
    await loadDataTable();
    searchSubmit(searchParams);
  };

  onMounted(() => {
    nextTick(() => {
      loadDataTable();
    });
  });

  return {
    addUpdateModelRef,
    searchSchemas,
    tableSize,
    columns,
    tableLoading,
    tableData,
    expandedRowKeys,
    searchSubmit,
    reload,
  };
};
