import * as ExcelJS from 'exceljs';
import { PassThrough } from 'stream';
import { getTimeStamp } from './date';

/**
 * @description: 处理导入的csv文件
 * @param {Buffer} buffer
 * @param {number} startNum
 * @param {object} keyTem
 * @return {Promise<any[]>}
 */
export const excelCsvHandleBuffer = async (buffer: Buffer, startNum: number, cellHandler: object = {}, otherObj: object = {}): Promise<any[]> => {
  const result = [];
  const workbook = new ExcelJS.Workbook();
  // 将buffer 转化为stream流
  const passThrough = new PassThrough();
  const streams: any = passThrough.end(buffer);
  const worksheet = await workbook.csv.read(streams);
  if (!worksheet) return [];
  // 处理表格的数据
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > startNum) {
      const target = Object.assign({}, otherObj);
      row.eachCell((cell, cellNumber) => {
        let cellVal: any = cell.value;
        if (cellVal === '/') {
          cellVal = '';
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
