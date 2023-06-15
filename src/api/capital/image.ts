import { AxiosCapital } from '@/api/axios';

const basic = '/image';

/**
 * @description: 图片上传
 * @param {any} { data, headers, onUploadProgress, withCredentials }
 * @return {*}
 */
export const uploadImage = ({ data, headers, onUploadProgress, withCredentials }: any): Promise<any> => {
  return AxiosCapital.request({
    url: `${basic}/upload`,
    method: 'POST',
    data,
    headers,
    onUploadProgress,
    withCredentials,
  });
};

/**
 * @description: 查询图片分页列表
 * @param {any} data
 * @return {*}
 */
export const getPage = (data: any): Promise<any> => {
  return AxiosCapital.request({
    url: `${basic}/find_page`,
    method: 'POST',
    data,
  });
};

/**
 * @description: 查询图片分页列表
 * @return {*}
 */
export const getOnlyPublic = (): Promise<any> => {
  return AxiosCapital.request({
    url: `${basic}/only_public`,
    method: 'GET',
  });
};

/**
 * @description: 查询未使用的图片
 * @return {*}
 */
export const getOntUse = (): Promise<any> => {
  return AxiosCapital.request({
    url: `${basic}/not_use`,
    method: 'GET',
  });
};

/**
 * @description: 删除图片目录下的图片
 * @param {string} fileName
 * @return {*}
 */
export const removePublic = (fileName: string): Promise<any> => {
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
 * @return {*}
 */
export const removePublicAll = (fileNameArr: string[]): Promise<any> => {
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
 * @return {*}
 */
export const removeData = (imageId: string): Promise<any> => {
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
 * @return {*}
 */
export const removePublicAndData = (imageId: string): Promise<any> => {
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
 * @return {*}
 */
export const removePublicAndDataAll = (imageIdArr: string[]): Promise<any> => {
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
