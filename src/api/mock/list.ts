import { AxiosMock } from '@/api/axios';

// const basic = '/role';

//获取table
export function getTableList(params) {
  return AxiosMock.request({
    url: '/table/list',
    method: 'get',
    params,
  });
}
