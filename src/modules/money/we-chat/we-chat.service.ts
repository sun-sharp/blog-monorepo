import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { weCharExcelCellHandle } from 'src/common/constant/excel';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { excelCsvHandleBuffer, twoArrForTimeSameFilter } from 'src/common/excel';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { WeChat } from 'src/schemas/we-chat.schema';
import { CreateWeChatBatchDto, CreateWeChatDto } from './dto/create-we-chat.dto';
import { PageWeChatDto } from './dto/page-we-chat.dto';
import { UpdateWeChatDto } from './dto/update-we-chat.dto';

@Injectable()
export class WeChatService {
  response: IResponse;
  constructor(@InjectModel('WeChat') private readonly weChatModel: Model<WeChat>) {}

  /**
   * @description: 微信账单导入
   * @param {string} userId
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
          const result = await excelCsvHandleBuffer({
            buffer: buffer,
            startNum: 18,
            cellHandler: weCharExcelCellHandle,
          });
          if (!result)
            throw {
              message: '导入的数据失败！',
            };
          if (result.length === 0)
            throw {
              message: '导入的数据为空！',
            };
          // 对数据按照交易时间排序
          result.sort(function (a, b) {
            return b.tradeTime > a.tradeTime ? -1 : 1;
          });
          // const find = await this.weChatModel.find();
          // const result = twoArrForTimeSameFilter(excelArr, find, 'tradeTime');
          // if (result.length === 0)
          //   throw {
          //     message: '导入的数据交易时间全部和数据库的相同！',
          //   };
          // await this.weChatModel.create(...result);
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
          await this.weChatModel.create({
            ...body,
            userId,
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
   * @description: 新增微信账单
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
              message: '导入的数据交易时间全部和数据库的相同！',
            };
          await this.weChatModel.create(...filterArr.map((m) => ({ ...m, userId })));
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
   * @param {PageUserDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(userId: string, body: PageWeChatDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body })
        // 分页查询
        .then(async ({ userId, body }) => {
          const { size, current, tradeOtherPerson, inflowOrOutflow, billType } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: any = {
            userId,
            $or: [{ tradeOtherPerson: { $regex: tradeOtherPerson } }, { tradeOtherPersonRemarks: { $regex: tradeOtherPerson } }],
          };
          if (inflowOrOutflow) findData.inflowOrOutflow = inflowOrOutflow;
          if (billType) findData.billType = billType;
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
   * @description: 修改微信账单
   * @param {UpdateWeChatDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateWeChatDto): Promise<IResponse> {
    return (
      Promise.resolve({ body })
        .then(async ({ body }) => {
          const { weChatId, tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType } = body;
          await this.weChatModel.updateOne({ _id: weChatId }, { tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType });
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
}
