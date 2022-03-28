import { AxiosMoney } from '@/api/axios';

const basic = '/we-chat';

/**
 * @description 用户列表
 * @param params
 */
export function getPage(params) {
  return AxiosMoney.request({
    url: `${basic}/find_page`,
    method: 'POST',
    params,
  });
}
