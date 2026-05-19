import { AxiosCapital } from '@/api/axios';
import { ApiImageItem, ApiImagePageData, ReadImageItem } from '/#/api/capital/image';
import { TablePaginationResult } from '/#/components/table';

const basic = '/image';

/**
 * @description: 图片上传
 * @param {} { data, headers, onUploadProgress, withCredentials }
 */
// export const uploadImage = ({ data, headers, onUploadProgress, withCredentials }): Promise<ApiImageItem> => {
//   return AxiosCapital.request({
//     url: `${basic}/upload`,
//     method: 'POST',
//     data,
//     headers,
//     onUploadProgress,
//     withCredentials,
//   });
// };

/**
 * @description: 查询图片分页列表
 * @param {ApiImagePageData} data
 * @returns {Promise<TablePaginationResult<ApiImageItem[]>>}
 */
export const getPage = (data: ApiImagePageData): Promise<TablePaginationResult<ApiImageItem[]>> => {
  return AxiosCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 获取图片目录的全部文件
 * @returns {Promise<ReadImageItem[]>}
 */
export const getOnlyPublic = (): Promise<ReadImageItem[]> => {
  return AxiosCapital.request({
    url: `${basic}/only_public`,
    method: 'GET',
  });
};

/**
 * @description: 查询未使用的图片
 * @returns {Promise<ApiImageItem[]>}
 */
export const getOntUse = (): Promise<ApiImageItem[]> => {
  return AxiosCapital.request({
    url: `${basic}/not_use`,
    method: 'GET',
  });
};

/**
 * @description: 删除图片目录下的图片
 * @param {string} fileName
 * @returns {Promise<undefined>}
 */
export const removePublic = (fileName: string): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/remove_public/${fileName}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: false,
    },
  });
};

/**
 * @description: 批量删除图片目录下的图片
 * @param {string[]} fileNameArr
 * @returns {Promise<undefined>}
 */
export const removePublicAll = (fileNameArr: string[]): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/remove_public_all`,
    method: 'DELETE',
    data: {
      fileNameArr,
    },
    responseOptions: {
      isShowSuccessMessage: false,
    },
  });
};

/**
 * @description: 删除图片下的数据
 * @param {string} imageId
 * @returns {Promise<undefined>}
 */
export const removeData = (imageId: string): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/remove_data/${imageId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: false,
    },
  });
};

/**
 * @description: 删除 图片目录下的图片 和 图片下的数据
 * @param {string} imageId
 * @returns {Promise<undefined>}
 */
export const removePublicAndData = (imageId: string): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/remove_public_data/${imageId}`,
    method: 'DELETE',
    responseOptions: {
      isShowSuccessMessage: false,
    },
  });
};

/**
 * @description: 批量删除图片目录下的图片 和 图片下的数据
 * @param {string[]} imageIdArr
 * @returns {Promise<undefined>}
 */
export const removePublicAndDataAll = (imageIdArr: string[]): Promise<undefined> => {
  return AxiosCapital.request({
    url: `${basic}/remove_public_data_all`,
    method: 'DELETE',
    data: {
      imageIdArr,
    },
    responseOptions: {
      isShowSuccessMessage: false,
    },
  });
};
