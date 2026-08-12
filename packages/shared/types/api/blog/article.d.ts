import { ApiPaginateParams } from '../common';

// ==================== 基础字段分组 ====================

/**
 * @description: 文章保存/基础字段（不含ID、作者、时间）
 */
export interface ArticleBaseFields {
  // 文章的标题
  title: string;
  // 文章的简介
  brief: string;
  // 文章的类型标识
  categoryVal: number;
  // 文章的css名称
  cssName: string;
  // 文章的markdown内容
  markdownContent: string;
  // 是否加密
  isPrivate: boolean;
}

/**
 * @description: 文章扩展字段（作者信息、创建时间）
 */
export interface ArticleExtraFields {
  // 文章的作者
  authorId: string;
  // 文章的作者昵称
  authorNickname: string;
  // 文章的创建时间
  createTime: string;
}

/**
 * @description: 文章的id
 */
export interface ApiArticleId {
  // 文章id
  articleId: string;
}

// ==================== 导出业务类型 ====================

/**
 * @description: 文章保存参数
 */
export type ApiArticleSaveData = ArticleBaseFields;

/**
 * @description: 文章数据字段（含作者和时间）
 */
export type ApiArticle = ArticleBaseFields & ArticleExtraFields;

/**
 * @description: 文章的列表每项
 */
export type ApiArticleItem = ApiArticle & ApiArticleId;

/**
 * @description: 文章的详情数据
 */
export type ApiArticleDetails = ApiArticleItem & { htmlContent: string, cssContent: string };

/**
 * @description: 文章的移动端详情数据
 */
export type ApiArticleMobileDetails = Omit<
  ApiArticleItem,
  'markdownContent' | 'cssName'
> & { pid: string };

/**
 * @description: 文章的列表每项
 */
export type ApiLiteArticleItem = Omit<
  ApiArticle,
  'markdownContent' | 'cssName' | 'isPrivate' | 'authorNickname'
> & {
  isPrivate?: boolean;
  avatar?: string;
  authorNickname?: string;
} & ApiArticleId;

/**
 * @description: 文章更新参数
 */
export type ApiArticleUpdateData = ArticleBaseFields & ApiArticleId;

/**
 * @description: 全局类型查询传参（全部可选）
 */
export type ApiArticleSearchParams = Partial<{
  // 关键字
  keywords: string;
  // 文章分类
  categoryVal: number;
  // 是否加密（查询时允许 boolean 或 0/1）
  isPrivate: boolean | number;
}>;

/**
 * @description: 条件并分页获取全局类型列表参数
 */
export type ApiArticleFindPageData = ApiPaginateParams & ApiArticleSearchParams;

/**
 * @description: 根据id批量修改文章加密参数
 */
export type ApiBatchUpdatePrivateArticleData = {
  // 文章id数组
  articleIdArr: string[];
  // 是否加密
  isPrivate: boolean;
};

export interface UploadMdResult {
  markdownContent: string;
  htmlContent: string;
  cssContent: string;
}
