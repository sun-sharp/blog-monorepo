import { ExtractPropTypes, nextTick, reactive, ref, watch } from 'vue';
import { ApiArticleFormRules, ApiArticleItem, ApiArticleItemForm } from '/#/api/article';
import { FormItemRule } from 'naive-ui';
import { articleAPi } from '@/api';
import { useApiType } from '@/hooks';

// 初始化表单数据
const defaultFromFields = {
  title: null,
  brief: null,
  categoryVal: null,
  markdownContent: '',
  htmlContent: '',
};

// 添加文章 传参
export const ArticleAddProps = {
  row: {
    type: Object as PropType<Partial<ApiArticleItem>>,
    default: () => ({}),
  },
};

// 添加文章
export const useArticleAdd = (props: ExtractPropTypes<typeof ArticleAddProps>, emit: (event: 'changeShowType' | 'finished', ...args: any[]) => void) => {
  const addFormRef = ref<Component>();
  const addFromModel = reactive<ApiArticleItemForm>(Object.assign({}, defaultFromFields));
  const contTab = ref('md');

  const { getArticleCategoryOption } = useApiType();

  // 验证规则
  const validateMarkdown = (_rule: FormItemRule, value: string) => {
    if (!value) {
      return new Error('请输入文章内容');
    } else if (!addFromModel.htmlContent) {
      return new Error('预览文章内容数据不能为空，请检查代码');
    }
    return true;
  };
  const addFromRules: ApiArticleFormRules = {
    title: [
      { required: true, message: '请输入文章标题', trigger: ['blur', 'input'] },
      { min: 2, max: 30, message: '输入长度为2-30', trigger: ['blur', 'input'] },
    ],
    brief: [
      { required: true, message: '请输入文章简介', trigger: ['blur', 'input'] },
      { min: 5, message: '最短长度为5', trigger: ['blur', 'input'] },
    ],
    categoryVal: { type: 'number', required: true, message: '请选择文章分类', trigger: ['blur', 'change'] },
    markdownContent: {
      required: true,
      validator: validateMarkdown,
      trigger: ['input', 'blur'],
    },
  };

  // 确认保存或编辑
  const addFromId = ref('');
  const onSubmitOrEdit = () => {
    addFormRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        const postData = {
          title: addFromModel.title || '',
          brief: addFromModel.brief || '',
          categoryVal: addFromModel.categoryVal || 0,
          markdownContent: addFromModel.markdownContent,
          htmlContent: addFromModel.htmlContent,
        };
        const req = addFromId.value ? articleAPi.update({ articleId: addFromId.value, ...postData }) : articleAPi.save(postData);
        req.then(() => {
          emit('changeShowType', 'list');
          emit('finished');
        });
      }
    });
  };

  // 重置
  const resetFields = () => {
    Object.assign(addFromModel, defaultFromFields);
    nextTick(() => {
      addFormRef.value.restoreValidation();
    });
  };

  watch(
    () => props.row,
    (obj) => {
      addFromId.value = obj.articleId || '';
      resetFields();
      if (addFromId.value) {
        addFromModel.title = obj.title || '';
        addFromModel.brief = obj.brief || '';
        addFromModel.categoryVal = obj.categoryVal || 0;
        addFromModel.markdownContent = obj.markdownContent || '';
        addFromModel.htmlContent = obj.htmlContent || '';
      }
    },
    { immediate: true, deep: true }
  );

  return {
    addFormRef,
    addFromModel,
    contTab,
    addFromRules,
    categoryOptions: getArticleCategoryOption,
    onSubmitOrEdit,
    resetFields,
  };
};
