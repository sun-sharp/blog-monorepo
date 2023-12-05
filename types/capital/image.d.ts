/**
 * @description: 获取静态目录里的图片字段
 */
export interface ReadImageItem {
  name: string;
  imageType: string;
  fileName: string;
  url: string;
}

/**
 * @description: 上传之后的图片字段
 */
export interface UploadedImage {
  filename: string;
  size: number;
}

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
  uploadTime: Date;
  source: string;
}

/**
 * @description: 图片的列表每项
 */
export interface ApiImageItem extends Omit<ApiImage, 'uploadTime'>, ApiImageId {
  // 图片key值
  keyUrl: string;
  // 判断目录里的图片是否存在
  exists?: boolean;
  uploadTime: string;
}
