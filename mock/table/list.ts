import { Random } from 'mockjs';
import { resultSuccess, doCustomTimes } from '../_util';

const basic = '/mock-api';

const tableList = (pageSize) => {
  const result: any[] = [];
  doCustomTimes(pageSize, () => {
    result.push({
      id: '@integer(10,999999)',
      beginTime: '@datetime',
      endTime: '@datetime',
      address: '@city()',
      name: '@cname()',
      avatar: Random.image('400x400', Random.color(), Random.color(), Random.first()),
      date: `@date('yyyy-MM-dd')`,
      time: `@time('HH:mm')`,
      'no|100000-10000000': 100000,
      'status|1': [true, false],
    });
  });
  return result;
};

export default [
  //表格数据列表
  {
    url: `${basic}/table/list`,
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, size = 10 } = query;
      const list = tableList(Number(size));
      return resultSuccess({
        current: Number(current),
        size: Number(size),
        total: 200,
        list,
      });
    },
  },
];
