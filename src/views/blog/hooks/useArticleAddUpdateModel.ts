import { computed, nextTick, reactive, ref, unref } from 'vue';
import { ApiArticleItem } from '/#/api/blog/article';
import { FormItemRule } from 'naive-ui';
import { articleAPi } from '@/api';
import { useApiType } from '@/hooks';
import { ArticleFormRules, ArticleItemForm } from '/#/views/article';

// 初始化表单数据
const defaultFromFields = {
  title: null,
  brief: null,
  categoryVal: null,
  markdownContent: '',
  htmlContent: '',
};

// 添加文章弹窗 传参
export const ArticleAddUpdateModelProps = {};

// 添加文章弹窗
export const useArticleAddUpdateModel = (emit: (event: 'finished', ...args: any[]) => void) => {
  // 弹窗
  const modelId = ref('');
  const showModal = ref(false);
  const modelTitle = computed(() => (unref(modelId) ? '修改' : '新增') + '文章');

  // 文章id
  const addFromId = ref('');

  // 保存按钮
  const formBtnLoading = ref(false);

  // 表单
  const modelFromRef = ref<Component>();
  const modelForm = reactive<ArticleItemForm>(Object.assign({}, defaultFromFields));
  const contTab = ref('md');

  const { getArticleCategoryOption } = useApiType();

  // 验证规则
  const validateMarkdown = (_rule: FormItemRule, value: string) => {
    if (!value) {
      return new Error('请输入文章内容');
    } else if (!modelForm.htmlContent) {
      return new Error('预览文章内容数据不能为空，请检查代码');
    }
    return true;
  };
  const modelRules: ArticleFormRules = {
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

  // 重置
  const resetFields = () => {
    Object.assign(modelForm, defaultFromFields);
    nextTick(() => {
      modelFromRef.value.restoreValidation();
    });
  };

  // 确认保存或编辑
  const onSubmitOrEdit = (isPrivate = false) => {
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        formBtnLoading.value = true;
        const postData = {
          title: modelForm.title || '',
          brief: modelForm.brief || '',
          categoryVal: modelForm.categoryVal || 0,
          markdownContent: modelForm.markdownContent,
          htmlContent: modelForm.htmlContent,
          isPrivate,
        };
        const req = addFromId.value ? articleAPi.update({ articleId: addFromId.value, ...postData }) : articleAPi.save(postData);
        req
          .then(() => {
            emit('finished');
            showModal.value = false;
          })
          .finally(() => {
            formBtnLoading.value = false;
          });
      }
    });
  };

  // 初始化
  const init = (row: ApiArticleItem) => {
    addFromId.value = row?.articleId;
    showModal.value = true;
    resetFields();
    if (addFromId.value) {
      modelForm.title = row.title || '';
      modelForm.brief = row.brief || '';
      modelForm.categoryVal = row.categoryVal || 0;
      modelForm.markdownContent = row.markdownContent || '';
      modelForm.htmlContent = row.htmlContent || '';
    }
  };

  return {
    showModal,
    modelTitle,
    modelFromRef,
    modelForm,
    modelRules,
    contTab,
    categoryOptions: getArticleCategoryOption,
    formBtnLoading,
    onSubmitOrEdit,
    resetFields,
    init,
  };
};
