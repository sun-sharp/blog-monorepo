import { PathLike, readdir, readFile, existsSync, unlink } from 'fs';
import { useCustomConfig } from 'src/config';
import { ReadImageItem } from 'types/capital/image';

const customConfig = useCustomConfig();

/**
 * @description: 获取静态目录里的图片
 * @param {PathLike} pathName
 * @return {Promise<ReadImageItem[]>}
 */
export const readdirOfImageHandle = (pathName: PathLike): Promise<ReadImageItem[]> => {
  return new Promise((resolve, reject) => {
    readdir(pathName, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const result = files.map((fileName) => ({
        name: fileName.split('.')[0] || '',
        imageType: fileName.split('.')[1] || '',
        fileName: fileName,
        url: `${customConfig.fileAccessPath}/image/${fileName}`,
      }));
      resolve(result);
    });
  });
};

/**
 * @description: 删除文件夹目录里的文件
 * @param {PathLike} pathName
 * @return {Promise<boolean>}
 */
export const unlinkHandle = (pathName: PathLike): Promise<boolean> => {
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
 * @description: 批量删除文件夹目录里的文件
 * @param {string} dir // 读取目录
 * @param {string[]} list
 * @return {Promise<Promise<{ message: string }>[]}
 */
export const unlinkListHandle = async (dir: string, list: string[]): Promise<{ message: string }[]> => {
  const promiseArr = list.map(
    (fileName) =>
      new Promise((resolve, reject) => {
        unlink(`${dir}/${fileName}`, (err) => {
          if (err) {
            reject({ err, fileName });
            return;
          }
          resolve({ fileName });
        });
      }),
  );
  const allValues = await Promise.allSettled(promiseArr);
  return allValues.map((m: any) => {
    let item: any = {};
    if (m.status === 'fulfilled') {
      item.message = `${m.fileName}删除成功！`;
    } else if (m.status === 'rejected') {
      item = { ...m.err };
      item.message = `${m.fileName}删除失败！`;
    }
    return item;
  });
};

/**
 * @description: 读取文件夹目录里的文件，并判断是否存在
 * @param {PathLike} pathName
 * @return {Promise<boolean>}
 */
export const readFileHandle = (pathName: PathLike): Promise<boolean> => {
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
 * @description: 读取某文件的数据
 * @param {PathLike} pathName
 * @return {Promise<any>}
 */
export const readFileDataHandle = (pathName: PathLike): Promise<any> => {
  return new Promise((resolve, reject) => {
    readFile(pathName, (err, data) => {
      if (err) {
        reject({ ...err, message: '文件夹里不存在当前文件' });
        return;
      }
      resolve(data);
    });
  });
};

/**
 * @description: 批量读取文件夹目录里的文件
 * @param {string} dir // 读取目录
 * @param {string[]} list
 */
export const readFileListHandle = (dir: string, list: string[]): Promise<unknown[]> => {
  const promiseArr = list.map(
    (fileName) =>
      new Promise((resolve, reject) => {
        readFile(`${dir}/${fileName}`, (err) => {
          if (err) {
            reject({ ...err, message: '文件夹里不存在文件' + fileName });
            return;
          }
          resolve(true);
        });
      }),
  );
  return Promise.all(promiseArr);
};

/**
 * @description: 判断文件夹目录里的文件是否存在
 * @param {PathLike} pathName
 * @return {boolean}
 */
export const existsSyncHandle = (pathName: PathLike): boolean => {
  return existsSync(pathName);
};

/**
 * @description: 判断文件夹目录里的文件是否存在
 * @param {PathLike} list
 * @return {any[]}
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
