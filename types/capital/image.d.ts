/**
 * @description: 图片分页查询数据库查询传参
 */
export interface ImageFindPageParams {
  name:
    | {
        $regex: string;
      }
    | string;
  source?: string;
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

/**
 * @description: 上传之后的图片字段
 */
export interface UploadedImage {
  filename: string;
  size: number;
}
