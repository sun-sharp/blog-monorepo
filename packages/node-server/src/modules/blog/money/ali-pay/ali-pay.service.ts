import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { aliPayExcelCellHandle } from 'src/common/constant/excel';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { excelCsvHandleBuffer, excelXlsxHandleBuffer, twoArrForTimeSameFilter } from 'src/common/excel';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { AliPay } from 'src/schemas/blog/money/ali-pay.schema';
import { CreateAliPayBatchDto, CreateAliPayDto } from './dto/create-ali-pay.dto';
import { PageAliPayDto } from './dto/page-ali-pay.dto';
import { UpdateAliPayDto } from './dto/update-ali-pay.dto';
import { ApiAliPayItem, ApiAliPayUpload } from '/#/api/blog/money/ali-pay';
import { IResponse } from '/#/common/common';
import { useCustomConfig } from 'src/config';
import { format } from 'date-fns';
import { isDateFormat, nowDateFun } from 'src/common/date';
import { logger } from 'src/common/journal';
import { billUploadTypeEnum } from 'src/common/enums/money.enum';
import { BillUploadService } from '../bill-upload/bill-upload.service';
import { StatisticsStartEndTimeDto } from 'src/common/dto/statistics-start-end-time.dto';
import * as path from 'path';
import { runCode } from 'src/common/string';
const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class AliPayService {
  constructor(
    @InjectModel(AliPay.name, blogDatabaseName) private readonly aliPayModel: Model<AliPay>,
    private readonly billUploadService: BillUploadService,
  ) {}

  /**
   * @description: 支付宝账单导入
   * @param {any} file           上传的文件对象
   * @param {number} startNum   数据起始行号，默认 26（支付宝账单）
   * @param {number} endNum    数据结束行号（包含），不传则到末尾
   * @param {number} size      每页数量，默认 50
   * @return {Promise<IResponse>}
   */
  public upload(file: any, startNum: number = 26, endNum?: number, size: number = 50): Promise<IResponse> {
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
    const parseFile = async (): Promise<ApiAliPayUpload[]> => {
      if (fileType === 'csv') {
        return await excelCsvHandleBuffer({
          buffer: file.buffer,
          startNum,
          endNum: endNum ?? 0, // 保持兼容你现有函数中“忽略末尾行数”的语义，如需改为结束行号请按方案B调整工具函数
          cellHandler: aliPayExcelCellHandle,
        });
      } else {
        return await excelXlsxHandleBuffer({
          buffer: file.buffer,
          sheetName: 'Sheet1', // 根据实际 sheet 名调整
          startNum,
          endNum: endNum ?? 0,
          cellHandler: aliPayExcelCellHandle,
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
          const find = await this.aliPayModel.find().lean();
          const result: ApiAliPayUpload[] = twoArrForTimeSameFilter(list, find, 'tradeTime', ['moneyAmount', 'productDescription']);
          if (result.length === 0) throw '导入的数据全部和数据库的相同！';
          // 对数据按照交易时间排序
          result.sort((a, b) => (b.tradeTime > a.tradeTime ? -1 : 1));
          logger.log(`支付宝账单 导入数据处理 成功！共 ${result.length} 个`);
          return result;
        })
        // 对数据进行批量处理
        .then(async (list) => {
          const total = list.length;
          const listSlice = list.slice(0, size);
          const billUploadList = await this.billUploadService.getDataByBillUploadType(billUploadTypeEnum.aliPay);
          logger.log(`支付宝账单 查询账单导入配置 成功！共 ${billUploadList.length} 个`);
          // 处理每项数据
          const formatBillUploadItem = (m: ApiAliPayUpload) => {
            const item = { ...m };
            const codeIt = { ...m };
            for (let i = 0; i < billUploadList.length; i++) {
              const f = billUploadList[i];
              // 提取 code 中所有 item.xxx 属性名并去重，判断是否都为字符串类型，如果不是，并且为空，那么给它赋值
              const itemProps = [...new Set([...f.code.matchAll(/item\.(\w+)/g)].map((m) => m[1]))];
              itemProps.forEach((prop) => {
                if (typeof codeIt[prop] !== 'string' && !codeIt[prop]) {
                  codeIt[prop] = '';
                }
              });
              // 判断是否赋值
              let runResult: any;
              try {
                runResult = runCode(f.code, { codeIt, isAssignment: false });
              } catch (err) {
                throw `规则执行失败 [规则ID: ${f._id}, handleType: ${f.handleType}, billType: ${f.billType}, billMethod: ${f.billMethod}, item: ${JSON.stringify(item)}], 错误: ${err}`;
              }
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
          logger.log(`支付宝账单导入${total}个`);
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
          logger.error(`支付宝账单导入 失败! ${err}`);
          return { code: ApiCode.ERROR, message: `${err}` || '导入失败！' };
        })
    );
  }

  /**
   * @description: 新增微信账单
   * @param {string} userId
   * @param {CreateAliPayDto} createAliPayDto
   * @return {Promise<IResponse>}
   */
  public save(userId: string, createAliPayDto: CreateAliPayDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createAliPayDto })
        // 添加
        .then(async ({ userId, body }) => {
          // 查询是否已经存在某交易时间的数据
          const { tradeTime, moneyAmount, productDescription, tradeOtherPerson } = body;
          const find = await this.aliPayModel.find({ userId, tradeTime, moneyAmount, productDescription, tradeOtherPerson });
          if (!find) throw '保存的数据交易时间和数据库的相同！';
          await this.aliPayModel.create({
            ...body,
            userId,
          });
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`支付宝账单保存 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 批量新增支付宝账单
   * @param {string} userId
   * @param {CreateAliPayBatchDto} createAliPayBatchDto
   * @return {Promise<IResponse>}
   */
  public batchSave(userId: string, createAliPayBatchDto: CreateAliPayBatchDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createAliPayBatchDto })
        // 添加
        .then(async ({ userId, body }) => {
          const { batches } = body;
          // 过滤掉相同交易时间的数据
          const find = await this.aliPayModel.find();
          const filterArr = twoArrForTimeSameFilter(batches, find, 'tradeTime', ['moneyAmount', 'productDescription', 'tradeOtherPerson']);
          if (filterArr.length === 0) throw '保存的数据全部和数据库的相同！';
          await this.aliPayModel.create(
            ...filterArr.map((m) => ({
              ...m,
              tradeTime: new Date(m.tradeTime),
              userId,
            })),
          );
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`批量新增支付宝账单 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 条件并分页获取支付宝账单列表
   * @param {string} userId
   * @param {PageAliPayDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(userId: string, body: PageAliPayDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body })
        // 分页查询
        .then(async ({ userId, body }) => {
          const { size, current, tradeTime, tradeOtherPerson, inflowOrOutflow, billType, billMethod } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<AliPay> = { userId };
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
          const total = await this.aliPayModel.find(findData).count();
          const findArr = await this.aliPayModel.find(findData).sort({ tradeTime: -1 }).limit(limit).skip(skip);
          const list: ApiAliPayItem[] = findArr.map(
            ({
              _id,
              userId,
              tradeTime,
              tradeType,
              tradeOtherPerson,
              tradeOtherPersonRemarks,
              productDescription,
              incomeOrPay,
              moneyAmount,
              otherCost,
              paymentMethod,
              oppositeAccount,
              inflowOrOutflow,
              explain,
              place,
              billType,
              billMethod,
              balance,
              balanceBaby,
            }) => ({
              aliPayId: _id,
              userId,
              tradeTime: nowDateFun(tradeTime),
              tradeType,
              tradeOtherPerson,
              tradeOtherPersonRemarks,
              productDescription,
              incomeOrPay,
              moneyAmount,
              otherCost,
              paymentMethod,
              oppositeAccount,
              inflowOrOutflow,
              explain,
              place,
              billType,
              billMethod,
              balance,
              balanceBaby,
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
          logger.error(`条件并分页获取支付宝账单列表 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 获取余额或余额宝，交易时间最新一条的数据
   * @param {string} userId
   * @param {'balance' | 'balanceBaby'} balanceType
   * @return {Promise<Array<AliPay>>}
   */
  public findLastOneBalance(userId: string, balanceType: 'balance' | 'balanceBaby'): Promise<Array<AliPay>> {
    return (
      Promise.resolve({ userId })
        .then(async ({ userId }) => {
          const findData: any = { userId };
          // 余额
          if (balanceType === 'balance') {
            findData.$or = [{ billMethod: 111 }, { billType: 602 }];
          }
          // 余额宝
          else if (balanceType === 'balanceBaby') {
            findData.$or = [{ billMethod: 112 }, { billType: 603 }];
          }
          return await this.aliPayModel.find(findData).sort({ tradeTime: -1 }).limit(1);
        })
        // 返回错误
        .catch((err) => {
          logger.error(`获取余额或余额宝，交易时间最新一条的数据 失败! ${err}`);
          return err;
        })
    );
  }

  /**
   * @description: 修改支付宝账单
   * @param {UpdateAliPayDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateAliPayDto): Promise<IResponse> {
    return (
      Promise.resolve({ body })
        .then(async ({ body }) => {
          const { aliPayId, tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType, billMethod } = body;
          await this.aliPayModel.updateOne({ _id: aliPayId }, { tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType, billMethod });
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改支付宝账单 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 处理支付宝余额
   * @param {string} userId
   * @param {StatisticsStartEndTimeDto} query
   * @return {Promise<IResponse>}
   */
  public updateBalance(userId: string, query: StatisticsStartEndTimeDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, query })
        .then(async ({ userId, query }) => {
          const find = await this.findModelAll(userId, query.startTime, query.endTime);
          // 获取支付宝余额(账单方式-支付宝余额，账单类型-支付宝余额充值)
          const filterArr = find.filter((f) => f.billMethod === 111 || f.billType === 602);
          // 其余的清空余额字段
          const restIds = find.filter((f) => f.billMethod !== 111 && f.billType !== 602).map((f) => f._id);
          if (restIds.length > 0) {
            await this.aliPayModel.updateMany({ _id: { $in: restIds } }, { balance: null });
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
            if (fe.inflowOrOutflow === 1 || fe.billType === 602) {
              prevBalance = prevBalance + fe.moneyAmount;
            } else if (fe.inflowOrOutflow === 2) {
              prevBalance = prevBalance - fe.moneyAmount;
            }
            bulkOps.push({
              updateOne: { filter: { _id: fe._id }, update: { balance: Number(prevBalance.toFixed(2)) } },
            });
          }
          if (bulkOps.length > 0) {
            await this.aliPayModel.bulkWrite(bulkOps);
          }
          return {
            code: ApiCode.SUCCESS,
            message: '处理成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`处理支付宝余额 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '处理失败！',
          };
        })
    );
  }

  /**
   * @description: 处理支付宝余额宝
   * @param {string} userId
   * @param {StatisticsStartEndTimeDto} query
   * @return {Promise<IResponse>}
   */
  public updateBalanceBaby(userId: string, query: StatisticsStartEndTimeDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, query })
        .then(async ({ userId, query }) => {
          const find = await this.findModelAll(userId, query.startTime, query.endTime);
          // 获取支付宝余额宝(账单方式-支付宝余额宝，账单类型-支付宝余额宝充值)
          const filterArr = find.filter((f) => f.billMethod === 112 || f.billType === 603);
          // 其余的清空余额宝字段
          const restIds = find.filter((f) => f.billMethod !== 112 && f.billType !== 603).map((f) => f._id);
          if (restIds.length > 0) {
            await this.aliPayModel.updateMany({ _id: { $in: restIds } }, { balanceBaby: null });
          }
          // 批量计算余额宝，避免循环中逐条查询
          const bulkOps: any[] = [];
          let prevBalance = 0;
          for (let fI = 0; fI < filterArr.length; fI++) {
            const fe = filterArr[fI];
            if (fI === 0) {
              prevBalance = fe.balanceBaby || 0;
              continue;
            }
            if (fe.inflowOrOutflow === 1 || fe.billType === 603) {
              prevBalance = prevBalance + fe.moneyAmount;
            } else if (fe.inflowOrOutflow === 2) {
              prevBalance = prevBalance - fe.moneyAmount;
            }
            bulkOps.push({
              updateOne: { filter: { _id: fe._id }, update: { balanceBaby: Number(prevBalance.toFixed(2)) } },
            });
          }
          if (bulkOps.length > 0) {
            await this.aliPayModel.bulkWrite(bulkOps);
          }
          return {
            code: ApiCode.SUCCESS,
            message: '处理成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`处理支付宝余额宝 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '处理失败！',
          };
        })
    );
  }

  /**
   * @description: 根据交易时间范围查询全部支付宝账单
   * @param {string} userId
   * @param {string} startTime
   * @param {string} endTime
   * @return {Promise<Array<AliPay>>}
   */
  public findModelAll(userId: string, startTime: string, endTime: string): Promise<Array<AliPay>> {
    return (
      Promise.resolve({ userId, startTime, endTime })
        .then(async ({ userId, startTime, endTime }) => {
          const findData: any = { userId };
          if (startTime && endTime) findData.tradeTime = { $gte: startTime, $lte: endTime };
          return await this.aliPayModel.find(findData).sort({ tradeTime: 1 });
        })
        // 返回错误
        .catch((err) => {
          logger.error(`根据交易时间范围查询全部支付宝账单 失败! ${err}`);
          return err;
        })
    );
  }

  /**
   * @description: 获取文章数据库信息
   * @return {Promise<AliPay>}
   */
  public findAllToData(): Promise<AliPay> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const list = await this.aliPayModel.find();
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
