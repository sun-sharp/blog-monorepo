import { ApiPaginateParams } from '../common';

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
  // 图片大小
  size: number;
  // 图片名称
  name: string;
  // 图片类型
  imageType: string;
  // 文件名
  fileName: string;
  // 图片地址
  url: string;
  // 上传时间
  uploadTime: string;
  // 来源
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
  // 图片名称
  name: string;
  // 图片类型
  imageType: string;
  // 文件名
  fileName: string;
  // 图片地址
  url: string;
}

/**
 * @description: 上传之后的图片字段
 */
export interface UploadedImage {
  // 文件名
  filename: string;
  // 文件大小
  size: number;
}

/**
 * @description: 图片查询传参
 */
export type ApiImageSearchParams = {
  // 图片名称
  name?: string;
  // 来源
  source?: string;
};

/**
 * @description: 条件并分页获取图片列表参数
 */
export type ApiImagePageData = ApiPaginateParams & ApiImageSearchParams;
