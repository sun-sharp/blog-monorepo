/**
 * @description: 文章的id
 */
export interface ApiArticleId {
  // 文章id
  articleId: string;
}

/**
 * @description: 文章数据字段
 */
export interface ApiArticle {
  // 文章的标题
  title: string;

  // 文章的简介
  brief: string;

  // 文章的html内容
  htmlContent: string;

  // 文章的markdown内容
  markdownContent: string;

  // 文章的作者
  authorId: string;

  // 文章的作者昵称
  authorNickname: string;

  // 文章的类型标识
  categoryVal: number;

  // 文章的创建时间
  createTime: string;
}

/**
 * @description: 文章的列表每项
 */
export interface ApiArticleItem extends ApiArticle, ApiArticleId {}
