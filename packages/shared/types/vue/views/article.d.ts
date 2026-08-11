import { FormItemRule } from 'naive-ui';

/**
 * @description:  文章 编辑表单 输入参数
 */
export interface ArticleItemForm {
  title: null | string;
  brief: null | string;
  categoryVal: null | number;
  markdownContent: string;
  cssContent: string;
}

/**
 * @description: 文章 编辑表单 输入权限
 */
export interface ArticleFormRules {
  title: FormItemRule[];
  brief: FormItemRule[];
  categoryVal: FormItemRule;
  markdownContent: FormItemRule;
}
