import { ApiPaginateParams } from '../common';

/**
 * @description: 全局类型查询传参
 */
export type ApiArticleSearchParams = {
  // 关键字
  keywords?: string;
  // 文章分类
  categoryVal?: number;
  // 是否加密
  isPrivate?: boolean | number;
};

/**
 * @description: 条件并分页获取全局类型列表参数
 */
export type ApiArticleFindPageData = ApiPaginateParams & ApiArticleSearchParams;

/**
 * @description: 文章的id
 */
export interface ApiArticleId {
  // 文章id
  articleId: string;
}

/**
 * @description:  文章保存参数
 */
export interface ApiArticleSaveData {
  // 文章的标题
  title: string;

  // 文章的简介
  brief: string;

  // 文章的类型标识
  categoryVal: number;

  // 文章的html内容
  htmlContent: string;

  // 文章的markdown内容
  markdownContent: string;

  // 文章的css内容
  cssContent: string;

  // 是否加密
  isPrivate: boolean;
}

/**
 * @description: 文章数据字段
 */
export interface ApiArticle extends ApiArticleSaveData {
  // 文章的作者
  authorId: string;

  // 文章的作者昵称
  authorNickname: string;

  // 文章的创建时间
  createTime: string;
}

/**
 * @description: 文章的列表每项
 */
export interface ApiArticleItem extends ApiArticle, ApiArticleId {}

/**
 * @description:  文章保存参数
 */
export type ApiArticleUpdateData = ApiArticleSaveData & ApiArticleId;

/**
 * @description:  根据id批量修改文章加密参数
 */
export type ApiBatchUpdatePrivateArticleData = {
  // 文章id数组
  articleIdArr: string[];

  // 是否加密
  isPrivate: boolean;
};
