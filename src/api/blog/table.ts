import { AxiosBlog } from '@/api/axios';

// const basic = '/role';

//获取table
export function getPage(params) {
  return AxiosBlog.request({
    url: '/table/list',
    method: 'get',
    params,
  });
}
