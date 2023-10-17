import { ApiPaginateParams } from './common';

/**
 * @description: 图片查询传参
 */
export type ApiImageSearchParams = {
  name?: string;
  source?: number;
};

/**
 * @description: 条件并分页获取图片列表参数
 */
export type ApiImagePageData = ApiPaginateParams & ApiImageSearchParams;

/**
 * @description: 图片的id
 */
export interface ApiImageId {
  // 图片id
  imageId: string;
}

/**
 * @description: 图片字段
 */
export interface ApiImage {
  size: number;
  name: string;
  imageType: string;
  fileName: string;
  url: string;
  uploadTime: string;
  source: string;
}

/**
 * @description: 图片的列表每项
 */
export interface ApiImageItem extends ApiImage, ApiImageId {
  // 判断目录里的图片是否存在
  exists?: boolean;
}

/**
 * @description: 获取静态目录里的图片字段
 */
export interface ReadImageItem {
  name: string;
  imageType: string;
  fileName: string;
  url: string;
}
