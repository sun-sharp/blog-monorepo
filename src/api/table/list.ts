import http from '@/api/axios';

// const basic = '/role';

//获取table
export function getTableList(params) {
  return http.request({
    url: '/table/list',
    method: 'get',
    params,
  });
}
