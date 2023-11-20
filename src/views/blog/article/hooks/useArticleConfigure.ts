import { getArticleCategoryData, useApiType } from '@/hooks';
import { onActivated, onMounted, ref } from 'vue';
import { ApiArticleItem } from '/#/api/article';

// 文章管理
export const useArticleConfigure = () => {
  const articleListRef = ref<Component>();

  const { getArticleCategoryOption } = useApiType();

  // 切换组件展示
  const showType = ref('list');
  const changeShowType = (type: string) => {
    showType.value = type;
  };

  // 添加完成
  const addFinished = () => {
    articleListRef.value.reloadTable();
  };

  // 新增传参
  const addChange = () => {
    changeShowType('add');
    rowParams.value = {};
  };

  // 编辑传参
  const rowParams = ref<Partial<ApiArticleItem>>({});
  const editChange = (row: ApiArticleItem) => {
    changeShowType('add');
    rowParams.value = row;
  };

  // 初始化
  const init = () => {
    getArticleCategoryData();
  };

  onActivated(init);
  onMounted(init);

  return {
    articleListRef,
    showType,
    articleCategoryOption: getArticleCategoryOption,
    rowParams,
    editChange,
    addChange,
    changeShowType,
    addFinished,
  };
};
