import { AxiosMock } from '@/api/axios';

// const basic = '/role';

//获取table
export function getPage(params) {
  return AxiosMock.request({
    url: '/table/list',
    method: 'get',
    params,
  });
}
