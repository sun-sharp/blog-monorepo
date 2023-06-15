import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { weChatExcelCellHandle } from 'src/common/constant/excel';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { excelCsvHandleBuffer, twoArrForTimeSameFilter } from 'src/common/excel';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { WeChat } from 'src/schemas/blog/we-chat.schema';
import { CreateWeChatBatchDto, CreateWeChatDto } from './dto/create-we-chat.dto';
import { PageWeChatDto } from './dto/page-we-chat.dto';
import { UpdateWeChatDto } from './dto/update-we-chat.dto';
import { weChatExcelTargetHandler } from 'src/common/utils/money';
import { StatisticsStartEndTimeDto } from '../dto/statistics-start-end-time.dto';

@Injectable()
export class WeChatService {
  response: IResponse;
  constructor(@InjectModel('WeChat') private readonly weChatModel: Model<WeChat>) {}

  /**
   * @description: 微信账单导入
   * @param {any} file
   * @return {Promise<IResponse>}
   */
  public upload(file: any): Promise<IResponse> {
    return (
      Promise.resolve({ file })
        // 导入数据处理
        .then(async ({ file }) => {
          const { buffer } = file; // file为前端上传的excel
          // 微信的菜单处理
          const list = await excelCsvHandleBuffer({
            buffer: buffer,
            startNum: 18,
            cellHandler: weChatExcelCellHandle,
            targetHandler: weChatExcelTargetHandler,
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
          const find = await this.weChatModel.find();
          const result = twoArrForTimeSameFilter(list, find, 'tradeTime');
          if (result.length === 0)
            throw {
              message: '导入的数据交易时间全部和数据库的相同！',
            };
          // 对数据按照交易时间排序
          result.sort(function (a, b) {
            return b.tradeTime > a.tradeTime ? -1 : 1;
          });
          return (this.response = {
            code: ApiCode.SUCCESS,
            result,
            message: '导入成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '导入失败！',
          });
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
          const { tradeTime = '' } = body;
          const find = await this.weChatModel.find({ userId, tradeTime });
          if (!find)
            throw {
              message: '保存的数据交易时间和数据库的相同！',
            };
          await this.weChatModel.create({
            ...body,
            userId,
            balance: 0,
          });
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '添加失败！',
          });
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
          const filterArr = twoArrForTimeSameFilter(batches, find, 'tradeTime');
          if (filterArr.length === 0)
            throw {
              message: '保存的数据交易时间全部和数据库的相同！',
            };
          await this.weChatModel.create(...filterArr.map((m) => ({ ...m, userId, balance: 0 })));
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '添加失败！',
          });
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
          const { size, current, tradeOtherPerson, inflowOrOutflow, billType, billMethod } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: any = {
            userId,
            $or: [{ tradeOtherPerson: { $regex: tradeOtherPerson } }, { tradeOtherPersonRemarks: { $regex: tradeOtherPerson } }],
          };
          if (inflowOrOutflow) findData.inflowOrOutflow = inflowOrOutflow;
          if (billType) findData.billType = billType;
          if (billMethod) findData.billMethod = billMethod;
          const total = await this.weChatModel.find(findData).count();
          const list = await this.weChatModel.find(findData).sort({ tradeTime: 1 }).limit(limit).skip(skip);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              current,
              list: list.map(
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
                }),
              ),
              size,
              total,
            },
            message: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          });
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
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          });
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
          for (let fI = 0; fI < filterArr.length; fI++) {
            const fe = filterArr[fI];
            if (fI !== 0) {
              const preId = filterArr[fI - 1]._id;
              const findOne = await this.weChatModel.findOne({ _id: preId });
              let balance = findOne.balance || 0;
              if (fe.inflowOrOutflow === 1 || fe.billType === 601) {
                balance = balance + fe.moneyAmount;
              } else if (fe.inflowOrOutflow === 2) {
                balance = balance - fe.moneyAmount;
              }
              await this.weChatModel.updateOne({ _id: fe._id }, { balance: Number(balance.toFixed(2)) });
            }
          }
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '处理成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '处理失败！',
          });
        })
    );
  }
}
