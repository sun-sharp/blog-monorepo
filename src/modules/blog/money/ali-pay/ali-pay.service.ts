import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { aliPayExcelCellHandle } from 'src/common/constant/excel';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { excelCsvHandleBuffer, twoArrForTimeSameFilter } from 'src/common/excel';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { AliPay } from 'src/schemas/blog/money/ali-pay.schema';
import { CreateAliPayBatchDto, CreateAliPayDto } from './dto/create-ali-pay.dto';
import { PageAliPayDto } from './dto/page-ali-pay.dto';
import { UpdateAliPayDto } from './dto/update-ali-pay.dto';
import { aliPayExcelTargetHandler } from 'src/common/utils/money';
import { StatisticsStartEndTimeDto } from '../dto/statistics-start-end-time.dto';
import { ApiAliPayItem, ApiAliPayUpload } from 'types/blog/money/ali-pay';
import { IResponse } from 'types/common';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class AliPayService {
  constructor(@InjectModel(AliPay.name, blogDatabaseName) private readonly aliPayModel: Model<AliPay>) {}

  /**
   * @description: 支付宝账单导入
   * @param {any} file
   * @return {Promise<IResponse>}
   */
  public upload(file: any): Promise<IResponse> {
    return (
      Promise.resolve({ file })
        // 导入数据处理
        .then(async ({ file }) => {
          const { buffer } = file; // file为前端上传的excel
          // 支付宝账单导入处理
          const list: ApiAliPayUpload[] = await excelCsvHandleBuffer({
            buffer: buffer,
            startNum: 26,
            endNum: 0,
            cellHandler: aliPayExcelCellHandle,
            targetHandler: aliPayExcelTargetHandler,
          });
          if (!list)
            throw {
              message: '导入的数据失败！',
            };
          if (list.length === 0)
            throw {
              message: '导入的数据为空！',
            };
          // 过滤掉相同交易时间的数据
          const find = await this.aliPayModel.find();
          const result: ApiAliPayUpload[] = twoArrForTimeSameFilter(list, find, 'tradeTime');
          if (result.length === 0)
            throw {
              message: '导入的数据交易时间全部和数据库的相同！',
            };
          // 对数据按照交易时间排序
          result.sort((a, b) => {
            return b.tradeTime > a.tradeTime ? -1 : 1;
          });
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '导入成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '导入失败！',
          };
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
          const { tradeTime = '' } = body;
          const find = await this.aliPayModel.find({ userId, tradeTime });
          if (!find)
            throw {
              message: '保存的数据交易时间和数据库的相同！',
            };
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
          return {
            code: ApiCode.ERROR,
            message: err.message || '添加失败！',
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
          const filterArr = twoArrForTimeSameFilter(batches, find, 'tradeTime');
          if (filterArr.length === 0)
            throw {
              message: '保存的数据交易时间全部和数据库的相同！',
            };
          await this.aliPayModel.create(...filterArr.map((m) => ({ ...m, userId })));
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '添加失败！',
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
          const { size, current, tradeOtherPerson, inflowOrOutflow, billType, billMethod } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: any = {
            userId,
            $or: [{ tradeOtherPerson: { $regex: tradeOtherPerson } }, { tradeOtherPersonRemarks: { $regex: tradeOtherPerson } }],
          };
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
          return {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
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
          return {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
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
          for (let fI = 0; fI < filterArr.length; fI++) {
            const fe = filterArr[fI];
            if (fI !== 0) {
              const preId = filterArr[fI - 1]._id;
              const findOne = await this.aliPayModel.findOne({ _id: preId });
              let balance = findOne.balance || 0;
              if (fe.inflowOrOutflow === 1 || fe.billType === 602) {
                balance = balance + fe.moneyAmount;
              } else if (fe.inflowOrOutflow === 2) {
                balance = balance - fe.moneyAmount;
              }
              await this.aliPayModel.updateOne({ _id: fe._id }, { balance: Number(balance.toFixed(2)) });
            }
          }
          return {
            code: ApiCode.SUCCESS,
            message: '处理成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '处理失败！',
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
          // 获取支付宝余额(账单方式-支付宝余额宝，账单类型-支付宝余额宝充值)
          const filterArr = find.filter((f) => f.billMethod === 112 || f.billType === 603);
          for (let fI = 0; fI < filterArr.length; fI++) {
            const fe = filterArr[fI];
            if (fI !== 0) {
              const preId = filterArr[fI - 1]._id;
              const findOne = await this.aliPayModel.findOne({ _id: preId });
              let balanceBaby = findOne.balanceBaby || 0;
              if (fe.inflowOrOutflow === 1 || fe.billType === 603) {
                balanceBaby = balanceBaby + fe.moneyAmount;
              } else if (fe.inflowOrOutflow === 2) {
                balanceBaby = balanceBaby - fe.moneyAmount;
              }
              await this.aliPayModel.updateOne({ _id: fe._id }, { balanceBaby: Number(balanceBaby.toFixed(2)) });
            }
          }
          return {
            code: ApiCode.SUCCESS,
            message: '处理成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '处理失败！',
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
          return err;
        })
    );
  }
}
