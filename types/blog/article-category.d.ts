/**
 * @description: 文章的id
 */
export interface ApiArticleCategoryId {
  // 文章id
  articleCategoryId: string;
}

/**
 * @description: 文章数据字段
 */
export interface ApiArticleCategory {
  // 文章分类标识
  value: number;

  // 文章分类名称
  name: string;
}

/**
 * @description: 文章的列表每项
 */
export interface ApiArticleCategoryItem extends ApiArticleCategory, ApiArticleCategoryId {}
