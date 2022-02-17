import { PathLike, readdir, readFile, existsSync, unlink } from 'fs';

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

/**
 * @description: 删除文件夹目录里的文件
 * @param {PathLike} pathName
 * @return {*}
 */
export const unlinkHandle = (pathName: PathLike): any => {
  return new Promise((resolve, reject) => {
    unlink(pathName, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

/**
 * @description: 读取文件夹目录里的文件
 * @param {PathLike} pathName
 * @return {*}
 */
export const readFileHandle = (pathName: PathLike): any => {
  return new Promise((resolve, reject) => {
    readFile(pathName, (err) => {
      if (err) {
        reject({ ...err, message: '文件夹里不存在当前文件' });
        return;
      }
      resolve(true);
    });
  });
};

/**
 * @description: 判断文件夹目录里的文件是否存在
 * @param {PathLike} pathName
 * @return {*}
 */
export const existsSyncHandle = (pathName: PathLike): boolean => {
  return existsSync(pathName);
};

/**
 * @description: 判断文件夹目录里的文件是否存在
 * @param {PathLike} list
 * @return {*}
 */
export const existsSyncListHandle = (list: any[]): any[] => {
  return list.map((m) => {
    const doc = m._doc;
    return {
      ...doc,
      exists: existsSync(m.url),
    };
  });
};
