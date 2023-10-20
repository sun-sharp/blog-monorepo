import { computed, h, ref, unref } from 'vue';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { ApiArticleItem, ApiArticleSearchParams } from '/#/api/article';
import { articleAPi } from '@/api';
import { FormSchema } from '/#/components/form';
import { useApiType } from '@/hooks';
import { NButton, NPopconfirm } from 'naive-ui';
import { CNumOption } from '/#/config';

// 文章列表
export const useArticleList = (emit: (event: 'editChange', ...args: any[]) => void) => {
  const { getArticleCategoryOption } = useApiType();

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
  const columns = computed<BasicColumn<ApiArticleItem>[]>(() => [
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
              onClick: handleEdit.bind(null, row),
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

  return {
    actionRef,
    searchSchemas,
    columns,
    tableRowKey,
    loadDataTable,
    reloadTable,
    searchSubmit,
  };
};
