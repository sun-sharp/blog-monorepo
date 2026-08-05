import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { weChatExcelCellHandle } from 'src/common/constant/excel';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { excelCsvHandleBuffer, excelXlsxHandleBuffer, twoArrForTimeSameFilter } from 'src/common/excel';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { WeChat } from 'src/schemas/blog/money/we-chat.schema';
import { CreateWeChatBatchDto, CreateWeChatDto } from './dto/create-we-chat.dto';
import { PageWeChatDto } from './dto/page-we-chat.dto';
import { UpdateWeChatDto } from './dto/update-we-chat.dto';
import { StatisticsStartEndTimeDto } from 'src/common/dto/statistics-start-end-time.dto';
import { ApiWeChatItem, ApiWeChatUpload } from '/#/api/blog/money/we-chat';
import { IResponse } from '/#/common/common';
import { useCustomConfig } from 'src/config';
import { format } from 'date-fns';
import { isDateFormat, nowDateFun } from 'src/common/date';
import { logger } from 'src/common/journal';
import { BillUploadService } from '../bill-upload/bill-upload.service';
import { billUploadTypeEnum } from 'src/common/enums/money.enum';
import * as path from 'path';
import { runCode } from '@/common/string';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class WeChatService {
  constructor(
    @InjectModel(WeChat.name, blogDatabaseName) private readonly weChatModel: Model<WeChat>,
    private readonly billUploadService: BillUploadService,
  ) {}

  /**
   * @description: 微信账单导入（根据文件类型调用不同解析函数）
   * @param {any} file           上传的文件对象
   * @param {number} startNum   数据起始行号，默认 19（微信账单）
   * @param {number} endNum     结束行号（含），不传则到末尾
   * @param {number} size       每页数量，默认 50
   * @return {Promise<IResponse>}
   */
  public upload(file: any, startNum: number = 19, endNum?: number, size: number = 50): Promise<IResponse> {
    // ---------- 判断文件类型 ----------
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    let fileType: 'csv' | 'xlsx' | 'unknown' = 'unknown';

    if (ext === '.csv' || mime === 'text/csv') {
      fileType = 'csv';
    } else if (ext === '.xlsx' || mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      fileType = 'xlsx';
    } else {
      return Promise.reject('不支持的文件格式，请上传 CSV 或 XLSX 文件');
    }

    // ---------- 定义解析函数调用映射 ----------
    const parseFile = async (): Promise<ApiWeChatUpload[]> => {
      if (fileType === 'csv') {
        return await excelCsvHandleBuffer({
          buffer: file.buffer,
          startNum,
          endNum: endNum ?? 0, // 保持兼容你现有函数中“忽略末尾行数”的语义，如需改为结束行号请按方案B调整工具函数
          cellHandler: weChatExcelCellHandle,
        });
      } else {
        return await excelXlsxHandleBuffer({
          buffer: file.buffer,
          sheetName: 'Sheet1', // 根据实际 sheet 名调整
          startNum,
          endNum: endNum ?? 0,
          cellHandler: weChatExcelCellHandle,
        });
      }
    };
    // ---------- 3. 导入流程 ----------
    return (
      Promise.resolve()
        .then(async () => {
          const list = await parseFile();
          if (!list) throw '导入的数据失败！';
          // 判断验证数据是有问题
          const listFilter = list.filter((f) => typeof f.moneyAmount !== 'number' || !isDateFormat(f.tradeTime));

          if (listFilter.length > 0) throw `时间 ${listFilter.map((m) => m.tradeTime)} 的数据出错！`;
          if (list.length === 0) throw '导入的数据为空！';
          // 过滤掉相同交易时间的数据
          const find = await this.weChatModel.find();
          const result: ApiWeChatUpload[] = twoArrForTimeSameFilter(list, find, 'tradeTime', ['moneyAmount', 'goods']);
          if (result.length === 0) throw '导入的数据全部和数据库的相同！';
          // 对数据按照交易时间排序
          result.sort((a, b) => (b.tradeTime > a.tradeTime ? -1 : 1));
          return result;
        })
        // 对数据进行批量处理
        .then(async (list) => {
          const total = list.length;
          const listSlice = list.slice(0, size);
          const billUploadList = await this.billUploadService.getDataByBillUploadType(billUploadTypeEnum.weChat);
          // 处理每项数据
          const formatBillUploadItem = (m: ApiWeChatUpload) => {
            const item = { ...m };
            for (let i = 0; i < billUploadList.length; i++) {
              const f = billUploadList[i];
              // 判断是否赋值
              const runResult = runCode(f.code, { item, isAssignment: false });
              const isAssignment = runResult.isAssignment;
              if (isAssignment) {
                if (f.handleType === 'inflowOrOutflow') {
                  // 存在则不再次赋值
                  if (!item.inflowOrOutflow) {
                    item.inflowOrOutflow = f.inflowOrOutflow;
                  }
                  continue;
                } else if (isAssignment && f.handleType === 'billType') {
                  // 存在则不再次赋值
                  if (!item.billType) {
                    item.billType = f.billType;
                  }
                  continue;
                } else if (isAssignment && f.handleType === 'billMethod') {
                  // 存在则不再次赋值
                  if (!item.billMethod) {
                    item.billMethod = f.billMethod;
                  }
                  continue;
                }
              }
            }
            return item;
          };
          const result = listSlice.map((m) => {
            return formatBillUploadItem(m);
          });
          logger.log(`微信账单导入${total}个`);
          return {
            code: ApiCode.SUCCESS,
            result: {
              total,
              list: result,
            },
            message: '导入成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`微信账单导入失败! ${err}`);
          return { code: ApiCode.ERROR, message: err || '导入失败！' };
        })
    );
  }

  /**
   * @description: 新增微信账单
   * @param {string} userId
   * @param {CreateWeChatDto} createWeChatDto
   * @return {Promise<IResponse>}
   */
  public save(userId: string, createWeChatDto: CreateWeChatDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createWeChatDto })
        // 添加
        .then(async ({ userId, body }) => {
          // 查询是否已经存在某交易时间的数据
          const { tradeTime, moneyAmount, goods, tradeOtherPerson } = body;
          const find = await this.weChatModel.find({ userId, tradeTime, moneyAmount, goods, tradeOtherPerson });
          if (!find) throw '保存的数据和数据库的相同！';
          await this.weChatModel.create({
            ...body,
            userId,
            balance: 0,
          });
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`新增微信账单 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 批量新增微信账单
   * @param {string} userId
   * @param {CreateWeChatBatchDto} createWeChatBatchDto
   * @return {Promise<IResponse>}
   */
  public batchSave(userId: string, createWeChatBatchDto: CreateWeChatBatchDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createWeChatBatchDto })
        // 添加
        .then(async ({ userId, body }) => {
          const { batches } = body;
          // 过滤掉相同交易时间的数据
          const find = await this.weChatModel.find();
          const filterArr = twoArrForTimeSameFilter(batches, find, 'tradeTime', ['moneyAmount', 'goods', 'tradeOtherPerson']);
          if (filterArr.length === 0) throw '保存的数据全部和数据库的相同！';
          await this.weChatModel.create(
            ...filterArr.map((m) => ({
              ...m,
              tradeTime: new Date(m.tradeTime),
              userId,
              balance: 0,
            })),
          );
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`批量新增微信账单 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 条件并分页获取微信账单
   * @param {string} userId
   * @param {PageWeChatDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(userId: string, body: PageWeChatDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body })
        // 分页查询
        .then(async ({ userId, body }) => {
          const { size, current, tradeTime, tradeOtherPerson, inflowOrOutflow, billType, billMethod } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<WeChat> = { userId };
          if (tradeTime) {
            // 筛选当天的数据
            const startTime = format(new Date(tradeTime), `yyyy-MM-dd 00:00:00`);
            const endTime = format(new Date(tradeTime), `yyyy-MM-dd 23:59:59`);
            findData.tradeTime = { $gte: startTime, $lte: endTime };
          }
          if (tradeOtherPerson) findData.$or = [{ tradeOtherPerson: { $regex: tradeOtherPerson } }, { tradeOtherPersonRemarks: { $regex: tradeOtherPerson } }];
          if (inflowOrOutflow) findData.inflowOrOutflow = inflowOrOutflow;
          if (billType) findData.billType = billType;
          if (billMethod) findData.billMethod = billMethod;
          const total = await this.weChatModel.find(findData).count();
          const findArr = await this.weChatModel.find(findData).sort({ tradeTime: -1 }).limit(limit).skip(skip);
          const list: ApiWeChatItem[] = findArr.map(
            ({
              _id,
              userId,
              tradeTime,
              tradeType,
              tradeOtherPerson,
              tradeOtherPersonRemarks,
              goods,
              incomeOrPay,
              moneyAmount,
              paymentMethod,
              currentStatus,
              remarks,
              inflowOrOutflow,
              explain,
              place,
              billType,
              otherCost,
              billMethod,
              balance,
            }) => ({
              weChatId: _id,
              userId,
              tradeTime: nowDateFun(tradeTime),
              tradeType,
              tradeOtherPerson,
              tradeOtherPersonRemarks,
              goods,
              incomeOrPay,
              moneyAmount,
              paymentMethod,
              currentStatus,
              remarks,
              inflowOrOutflow,
              explain,
              place,
              billType,
              otherCost,
              billMethod,
              balance,
            }),
          );
          return {
            code: ApiCode.SUCCESS,
            result: { current, list, size, total },
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`条件并分页获取微信账单 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 根据交易时间范围查询全部微信账单
   * @param {string} userId
   * @param {string} startTime
   * @param {string} endTime
   * @return {Promise<Array<WeChat>>}
   */
  public findModelAll(userId: string, startTime: string, endTime: string): Promise<Array<WeChat>> {
    return (
      Promise.resolve({ userId, startTime, endTime })
        .then(async ({ userId, startTime, endTime }) => {
          const findData: any = { userId };
          if (startTime && endTime) findData.tradeTime = { $gte: startTime, $lte: endTime };
          return await this.weChatModel.find(findData).sort({ tradeTime: 1 });
        })
        // 返回错误
        .catch((err) => {
          logger.error(`根据交易时间范围查询全部微信账单 失败! ${err}`);
          return err;
        })
    );
  }

  /**
   * @description: 获取微信零钱，交易时间最新一条的数据
   * @param {string} userId
   * @return {Promise<Array<WeChat>>}
   */
  public findLastOneBalance(userId: string): Promise<Array<WeChat>> {
    return (
      Promise.resolve({ userId })
        .then(async ({ userId }) => {
          const findData: any = { userId, $or: [{ billMethod: 101 }, { billType: 601 }] };
          return await this.weChatModel.find(findData).sort({ tradeTime: -1 }).limit(1);
        })
        // 返回错误
        .catch((err) => {
          logger.error(`获取微信零钱，交易时间最新一条的数据 失败! ${err}`);
          return err;
        })
    );
  }

  /**
   * @description: 修改微信账单
   * @param {UpdateWeChatDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateWeChatDto): Promise<IResponse> {
    return (
      Promise.resolve({ body })
        .then(async ({ body }) => {
          const { weChatId, tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType, billMethod } = body;
          await this.weChatModel.updateOne({ _id: weChatId }, { tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType, billMethod });
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改微信账单 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 处理微信余额
   * @param {string} userId
   * @param {StatisticsStartEndTimeDto} query
   * @return {Promise<IResponse>}
   */
  public updateBalance(userId: string, query: StatisticsStartEndTimeDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, query })
        .then(async ({ userId, query }) => {
          const find = await this.findModelAll(userId, query.startTime, query.endTime);
          // 获取零钱的零钱(账单方式-微信零钱，账单类型-零钱充值)
          const filterArr = find.filter((f) => f.billMethod === 101 || f.billType === 601);
          // 其余的清空余额字段
          const restIds = find.filter((f) => f.billMethod !== 101 && f.billType !== 601).map((f) => f._id);
          if (restIds.length > 0) {
            await this.weChatModel.updateMany({ _id: { $in: restIds } }, { balance: null });
          }
          // 批量计算余额，避免循环中逐条查询
          const bulkOps: any[] = [];
          let prevBalance = 0;
          for (let fI = 0; fI < filterArr.length; fI++) {
            const fe = filterArr[fI];
            if (fI === 0) {
              prevBalance = fe.balance || 0;
              continue;
            }
            if (fe.inflowOrOutflow === 1 || fe.billType === 601) {
              prevBalance = prevBalance + fe.moneyAmount;
            } else if (fe.inflowOrOutflow === 2) {
              prevBalance = prevBalance - fe.moneyAmount;
            }
            bulkOps.push({
              updateOne: { filter: { _id: fe._id }, update: { balance: Number(prevBalance.toFixed(2)) } },
            });
          }
          if (bulkOps.length > 0) {
            await this.weChatModel.bulkWrite(bulkOps);
          }
          return {
            code: ApiCode.SUCCESS,
            message: '处理成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`处理微信余额 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '处理失败！',
          };
        })
    );
  }

  /**
   * @description: 获取文章数据库信息
   * @return {Promise<WeChat>}
   */
  public findAllToData(): Promise<WeChat> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const list = await this.weChatModel.find();
          return list;
        })
        // 返回错误
        .catch((err) => {
          logger.error(`获取文章数据库信息 失败! ${err}`);
          return err;
        })
    );
  }
}
