import { PathLike, readdir } from 'fs';

/**
 * @description: 获取文件夹目录里的文件
 * @param {PathLike} pathName
 * @return {*}
 */
export const readdirHandle = (pathName: PathLike): any => {
  return new Promise((resolve, reject) => {
    readdir(pathName, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const result = files.map((item) => ({
        name: item.split('.')[0] || '',
        imageType: item.split('.')[1] || '',
        fileName: item,
      }));
      resolve(result);
    });
  });
};
