import { AxiosFile } from '@/api/axios';

const basic = '/image';

/**
 * @description: 查询图片分页列表
 * @param {any} params
 * @return {*}
 */
export const getPage = (params: any): Promise<any> => {
  return AxiosFile.request({
    url: `${basic}/find_page`,
    method: 'POST',
    params,
  });
};

/**
 * @description: 删除 图片目录下的图片 和 图片下的数据
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
 * @description: 删除图片下的数据
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
