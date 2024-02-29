import { getArticleCategoryData, useApiType } from '@/hooks';
import { computed, h, onActivated, onMounted, ref, unref } from 'vue';
import { ApiArticleItem, ApiArticleSearchParams, ApiBatchUpdatePrivateArticleData } from '/#/api/blog/article';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { articleAPi } from '@/api';
import { FormSchema } from '/#/components/form';
import { NButton, NPopconfirm, useMessage } from 'naive-ui';
import { CNumOption } from '/#/config';

// 文章管理
export const useArticleConfigure = () => {
  const nMessage = useMessage();

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
        filterable: true,
        placeholder: '请选择文章分类',
        options: unref(getArticleCategoryOption),
      },
    },
    {
      field: 'isPrivate',
      component: 'NSelect',
      label: '是否加密',
      componentProps: {
        defaultValue: null,
        filterable: true,
        placeholder: '请选择是否加密',
        options: [
          {
            value: 1,
            label: '加密',
          },
          {
            value: 2,
            label: '不加密',
          },
        ],
      },
    },
  ]);

  // 删除
  const handleDelete = (row: Recordable) => {
    articleAPi.remove(row.articleId).then(() => {
      reloadTable();
    });
  };
  // 导出
  const exportLoading = ref<boolean>(false);
  const handleExport = (row: Recordable) => {
    const fileName = `${row.title}.pdf`;
    exportLoading.value = true;
    articleAPi
      .exportArticle(row.articleId, fileName)
      .then(() => {
        nMessage.success('导出成功！');
      })
      .catch(() => {
        nMessage.error('导出失败！');
      })
      .finally(() => {
        exportLoading.value = false;
      });
  };
  const columns = computed<BasicColumn<ApiArticleItem>[]>(() => [
    {
      title: '文章标题',
      key: 'title',
      ellipsis: {
        tooltip: true,
      },
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
      title: '是否加密',
      key: 'isPrivate',
      render(row) {
        return row.isPrivate ? '是' : '否';
      },
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
          h(
            NButton,
            {
              class: 'mh-3',
              text: true,
              type: 'success',
              loading: exportLoading.value,
              onClick: handleExport.bind(null, row),
            },
            {
              default: () => '导出',
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
    searchParams.value = {
      ...values,
      isPrivate: values ? (values.isPrivate === 1 ? true : values.isPrivate === 2 ? false : undefined) : undefined,
    };
    actionRef.value.updatePage(1);
    actionRef.value.updateCheckedRowKeys();
  };

  // 列表选中
  const checkedRowKeys = ref<string[]>([]);
  const checkedRowKeysDisabled = computed(() => checkedRowKeys.value.length === 0);
  const tableCheckedRowKeys = (rowKeys?: string[]) => {
    checkedRowKeys.value = rowKeys ? rowKeys : [];
  };

  // 调用批量修改文章加密接口
  const privateBtnDisabled = ref(false);
  const notPrivateBtnDisabled = ref(false);
  const callBatchUpdatePrivate = async (isPrivate: boolean) => {
    const params: ApiBatchUpdatePrivateArticleData = {
      articleIdArr: unref(checkedRowKeys),
      isPrivate,
    };
    return await articleAPi.batchUpdatePrivate(params);
  };

  // 加密
  const privateChange = () => {
    privateBtnDisabled.value = true;
    callBatchUpdatePrivate(true)
      .then(() => {
        reloadTable();
      })
      .finally(() => {
        privateBtnDisabled.value = false;
      });
  };

  // 不加密
  const notPrivateChange = () => {
    notPrivateBtnDisabled.value = true;
    callBatchUpdatePrivate(false)
      .then(() => {
        reloadTable();
      })
      .finally(() => {
        notPrivateBtnDisabled.value = false;
      });
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
    checkedRowKeysDisabled,
    privateBtnDisabled,
    notPrivateBtnDisabled,
    searchSubmit,
    loadDataTable,
    tableRowKey,
    reloadTable,
    tableCheckedRowKeys,
    privateChange,
    notPrivateChange,
  };
};
