import { AxiosFile } from '@/api/axios';

const basic = '/image';

/**
 * @description: 查询图片分页列表
 * @param {any} data
 * @return {*}
 */
export const getPage = (data: any): Promise<any> => {
  return AxiosFile.request({
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
  return AxiosFile.request({
    url: `${basic}/only_public`,
    method: 'GET',
  });
};

/**
 * @description: 删除图片目录下的图片
 * @param {string} fileName
 * @return {*}
 */
export const removePublic = (fileName: string): Promise<any> => {
  return AxiosFile.request(
    {
      url: `${basic}/remove_public/${fileName}`,
      method: 'DELETE',
    },
    {
      isShowSuccessMessage: true,
    }
  );
};

/**
 * @description: 批量删除图片目录下的图片
 * @param {string[]} fileName
 * @return {*}
 */
export const removePublicAll = (fileNameArr: string[]): Promise<any> => {
  return AxiosFile.request(
    {
      url: `${basic}/remove_public_all`,
      method: 'DELETE',
      data: {
        fileNameArr,
      },
    },
    {
      isShowSuccessMessage: true,
    }
  );
};

/**
 * @description: 删除图片下的数据
 * @param {string} imageId
 * @return {*}
 */
export const removeData = (imageId: string): Promise<any> => {
  return AxiosFile.request(
    {
      url: `${basic}/remove_data/${imageId}`,
      method: 'DELETE',
    },
    {
      isShowSuccessMessage: true,
    }
  );
};

/**
 * @description: 删除 图片目录下的图片 和 图片下的数据
 * @param {string} imageId
 * @return {*}
 */
export const removePublicAndData = (imageId: string): Promise<any> => {
  return AxiosFile.request(
    {
      url: `${basic}/remove_public_data/${imageId}`,
      method: 'DELETE',
    },
    {
      isShowSuccessMessage: true,
    }
  );
};
