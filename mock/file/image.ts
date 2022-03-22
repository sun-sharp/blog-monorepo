import { resultSuccess, doCustomTimes } from '../_util';

const imageList = (size) => {
  const result: any[] = [];
  doCustomTimes(size, () => {
    result.push({
      imageId: '@string(10)',
      size: '@integer(10,100)',
      name: '@cname()',
      imageType: 'jpg',
      fileName: 'llll',
      url: 'jaskdhsakdask',
      uploadTime: 'asdsadsaas',
      source: '阿斯顿撒大撒',
    });
  });
  return result;
};

const basic = '/file-api/image';

export default [
  {
    url: `${basic}/find_page`,
    timeout: 1000,
    method: 'post',
    response: ({ query }) => {
      const { current = 1, size = 10 } = query;
      const list = imageList(Number(size));
      return resultSuccess({
        current: Number(current),
        list,
        size: Number(size),
        total: 60,
      });
    },
  },
];
