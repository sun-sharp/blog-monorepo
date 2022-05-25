import * as ExcelJS from 'exceljs';
import { PassThrough } from 'stream';
import { getTimeStamp } from './date';

interface excelCsvHandleBufferObj {
  buffer: Buffer;
  startNum: number;
  endNum?: number;
  cellHandler: object;
  otherObj: object;
}

/**
 * @description: 处理导入的csv文件
 * @param {excelCsvHandleBufferObj} obj
 * @return {Promise<any[]>}
 */
export const excelCsvHandleBuffer = async (obj: excelCsvHandleBufferObj): Promise<any[]> => {
  const { buffer, startNum, endNum = 0, cellHandler = {}, otherObj = {} } = obj;
  const result = [];
  const workbook = new ExcelJS.Workbook();
  // 将buffer 转化为stream流
  const passThrough = new PassThrough();
  const streams: any = passThrough.end(buffer);
  const worksheet = await workbook.csv.read(streams);
  if (!worksheet) return undefined;
  const rowCount = worksheet.rowCount;
  // 处理表格的数据
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > startNum && rowNumber < rowCount - endNum) {
      const target = Object.assign({}, otherObj);
      row.eachCell((cell, cellNumber) => {
        let cellVal: any = cell.value;
        if (['/', '-', '—'].includes(cellVal)) {
          cellVal = '';
        }
        const reg = /^\s+|\s+$/g;
        if (typeof cellVal === 'string' && cellVal.search(reg) > 0) {
          cellVal = cellVal.replace(reg, '');
        }
        cellHandler[cellNumber] && cellHandler[cellNumber](target, cellVal);
      });
      result.push(target);
    }
  });
  return result;
};

/**
 * @description: 两个数组比较，过滤掉相同时间的元素
 * @param {any} arrFilter
 * @param {any} findArr
 * @param {string} key
 * @return {any}
 */
export const twoArrForTimeSameFilter = (arrFilter: any[], findArr: any[], key: string): any[] => {
  return arrFilter.filter((fil) => {
    const find = findArr.find((f) => getTimeStamp(fil[key]) === getTimeStamp(f[key]));
    return !find;
  });
};
