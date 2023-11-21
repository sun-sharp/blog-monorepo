import { getArticleCategoryData, useApiType } from '@/hooks';
import { computed, h, onActivated, onMounted, ref, unref } from 'vue';
import { ApiArticleItem, ApiArticleSearchParams } from '/#/api/article';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { articleAPi } from '@/api';
import { FormSchema } from '/#/components/form';
import { NButton, NPopconfirm } from 'naive-ui';
import { CNumOption } from '/#/config';

// 文章管理
export const useArticleConfigure = () => {
  const { getArticleCategoryOption } = useApiType();

  // 新增弹窗
  const addUpdateModelRef = ref<Component>();

  /**
   * 表格
   *  */
  const actionRef = ref<Component>();
  // 获取接口数据
  const searchParams = ref<ApiArticleSearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await articleAPi.getFindPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 表格key配置
  const tableRowKey = (row: ApiArticleItem): string => row.articleId;
  // 配置
  // 查询配置
  const searchSchemas = computed<FormSchema[]>(() => [
    {
      field: 'title',
      component: 'NInput',
      label: '文章标题',
      componentProps: {
        placeholder: '请输入文章标题',
      },
    },
    {
      field: 'categoryVal',
      component: 'NSelect',
      label: '文章分类',
      componentProps: {
        defaultValue: null,
        clearable: false,
        placeholder: '请选择文章分类',
        options: unref(getArticleCategoryOption),
      },
    },
  ]);

  // 删除
  const handleDelete = (row: Recordable) => {
    articleAPi.remove(row.articleId).then(() => {
      reloadTable();
    });
  };
  const columns = computed<BasicColumn<ApiArticleItem>[]>(() => [
    {
      title: '文章标题',
      key: 'title',
    },
    {
      title: '文章简介',
      key: 'brief',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '文章分类名称',
      key: 'categoryVal',
      render(row) {
        const find = unref(getArticleCategoryOption).find((f: CNumOption) => f.value === row.categoryVal);
        return find ? find.label : '';
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
    },
    {
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
  ]);

  /**
   * 查询
   *  */
  // 数据查询
  const searchSubmit = (values: ApiArticleSearchParams) => {
    searchParams.value = values;
    actionRef.value.updatePage(1);
  };

  // 初始化
  const init = () => {
    getArticleCategoryData();
  };

  onActivated(init);
  onMounted(init);

  return {
    actionRef,
    addUpdateModelRef,
    searchSchemas,
    columns,
    searchSubmit,
    loadDataTable,
    tableRowKey,
    reloadTable,
  };
};
