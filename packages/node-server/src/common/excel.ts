import * as ExcelJS from 'exceljs';
import { PassThrough } from 'stream';
import * as jschardet from 'jschardet';
import * as iconv from 'iconv-lite';
import { getTimeStamp } from './date';

interface excelCsvHandleBufferObj {
  buffer: Buffer;
  startNum: number;
  endNum?: number;
  cellHandler: object;
  targetHandler?: (tar: any) => void;
  otherObj?: object;
}

interface excelXlsxHandleBufferObj {
  buffer: Buffer;
  sheetName: string;
  startNum: number;
  endNum?: number;
  cellHandler: object;
  targetHandler?: (tar: any) => void;
  otherObj?: object;
}

// 参数接口重命名，更清晰
interface ParseSheetFromWorkbookParams {
  sheetName: string;
  workbook?: any; // ExcelJS.Workbook 实例（优先）
  buffer?: Buffer; // 保留作为降级方案
  startNum: number;
  endNum?: number;
  cellHandler?: Record<number, (target: any, val: any) => void>;
  targetHandler?: (target: any) => void;
  otherObj?: any;
}

/**
 * @description: 处理导入的csv文件
 * @param {excelCsvHandleBufferObj} obj
 * @return {Promise<any[]>}
 */
export const excelCsvHandleBuffer = async (obj: excelCsvHandleBufferObj): Promise<any[]> => {
  let { buffer, startNum, endNum = 0, cellHandler = {}, targetHandler, otherObj = {} } = obj;
  const detected = jschardet.detect(buffer);
  if (detected.encoding && detected.encoding.toLowerCase() !== 'utf-8' && iconv.encodingExists(detected.encoding)) {
    buffer = Buffer.from(iconv.decode(buffer, detected.encoding), 'utf-8');
  }
  const result = [];
  const workbook = new ExcelJS.Workbook();
  const passThrough = new PassThrough();
  const streams: any = passThrough.end(buffer);
  const worksheet = await workbook.csv.read(streams);
  if (!worksheet) return undefined;
  const rowCount = worksheet.rowCount;
  // 处理表格的数据
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber >= startNum && rowNumber <= (endNum ? endNum : rowCount)) {
      const target = Object.assign({}, otherObj);
      row.eachCell((cell, cellNumber) => {
        let cellVal: any = cell.value;
        // 去掉尾部的一些空格
        const reg = /^\s+|\s+$/g;
        if (typeof cellVal === 'string' && cellVal.search(reg) > 0) {
          cellVal = cellVal.replace(reg, '');
        }
        if (cellHandler[cellNumber]) {
          cellHandler[cellNumber](target, cellVal);
        }
      });
      if (typeof targetHandler === 'function') targetHandler(target);
      result.push(target);
    }
  });
  return result;
};

/**
 * @description: 处理导入的xlsx文件
 * @param {excelXlsxHandleBufferObj} obj
 * @return {Promise<any[]>}
 */
export const excelXlsxHandleBuffer = async (obj: excelXlsxHandleBufferObj): Promise<any[]> => {
  const { sheetName, startNum, endNum = 0, cellHandler = {}, targetHandler, otherObj = {} } = obj;
  const buffer = obj.buffer as any;
  const result = [];
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer); // 加载buffer文件
  const worksheet = workbook.getWorksheet(sheetName); // 获取excel表格的某个sheet
  if (!worksheet) return undefined;
  const rowCount = worksheet.rowCount;
  // 处理表格的数据
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber >= startNum && rowNumber <= (endNum ? endNum : rowCount)) {
      const target = Object.assign({}, otherObj);
      row.eachCell((cell, cellNumber) => {
        let cellVal: any = cell.value;
        // 去掉尾部的一些空格
        const reg = /^\s+|\s+$/g;
        if (typeof cellVal === 'string' && cellVal.search(reg) > 0) {
          cellVal = cellVal.replace(reg, '');
        }
        if (cellHandler[cellNumber]) {
          cellHandler[cellNumber](target, cellVal);
        }
      });
      if (typeof targetHandler === 'function') targetHandler(target);
      result.push(target);
    }
  });
  return result;
};

// 参数接口重命名，更清晰
interface ParseSheetFromWorkbookParams {
  sheetName: string;
  workbook?: any; // ExcelJS.Workbook 实例（优先）
  buffer?: Buffer; // 保留作为降级方案
  startNum: number;
  endNum?: number;
  cellHandler?: Record<number, (target: any, val: any) => void>;
  targetHandler?: (target: any) => void;
  otherObj?: any;
}

/**
 * 从（复用型）工作簿中解析指定 Sheet 数据
 * 支持传入预加载的 workbook，避免多次加载同一 Excel 文件
 */
export const parseSheetFromWorkbook = async (params: ParseSheetFromWorkbookParams): Promise<any[]> => {
  const { sheetName, startNum, endNum = 0, cellHandler = {}, targetHandler, otherObj = {}, buffer, workbook: providedWorkbook } = params;

  const result = [];
  // 优先使用传入的 workbook（体现多表共享），否则从 buffer 加载
  let workbook = providedWorkbook;
  if (!workbook) {
    if (!buffer) throw new Error('Either buffer or workbook must be provided');
    workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
  }

  const worksheet = workbook.getWorksheet(sheetName);
  if (!worksheet) return undefined;

  const rowCount = worksheet.rowCount;
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber >= startNum && rowNumber <= (endNum ? endNum : rowCount)) {
      const target = Object.assign({}, otherObj);
      row.eachCell((cell, cellNumber) => {
        let cellVal: any = cell.value;
        const reg = /^\s+|\s+$/g;
        if (typeof cellVal === 'string' && cellVal.search(reg) > 0) {
          cellVal = cellVal.replace(reg, '');
        }
        if (cellHandler[cellNumber]) {
          cellHandler[cellNumber](target, cellVal);
        }
      });
      if (typeof targetHandler === 'function') targetHandler(target);
      result.push(target);
    }
  });
  return result;
};

/**
 * @description: 两个数组比较，过滤掉相同时间，或更多条件的元素
 * @param {any} arrFilter
 * @param {any} findArr
 * @param {string} timeKey
 * @param {string[]} keyArr
 * @return {any[]}
 */
export const twoArrForTimeSameFilter = (arrFilter: any[], findArr: any[], timeKey: string, keyArr: string[] = []): any[] => {
  return arrFilter.filter((fil) => {
    const find = findArr.find((f) => {
      let dis = getTimeStamp(fil[timeKey]) === getTimeStamp(f[timeKey]);
      if (keyArr.length > 0) {
        dis = dis && keyArr.filter((fKey) => fil[fKey] !== f[fKey]).length === 0;
      }
      return dis;
    });
    return !find;
  });
};
