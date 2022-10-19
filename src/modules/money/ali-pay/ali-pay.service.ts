import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { aliPayExcelCellHandle } from 'src/common/constant/excel';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { excelCsvHandleBuffer, twoArrForTimeSameFilter } from 'src/common/excel';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { AliPay } from 'src/schemas/money/ali-pay.schema';
import { CreateAliPayBatchDto, CreateAliPayDto } from './dto/create-ali-pay.dto';
import { PageAliPayDto } from './dto/page-ali-pay.dto';
import { UpdateAliPayDto } from './dto/update-ali-pay.dto';

@Injectable()
export class AliPayService {
  response: IResponse;
  constructor(@InjectModel('AliPay') private readonly aliPayModel: Model<AliPay>) {}

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
          // 微信的菜单处理
          const result = await excelCsvHandleBuffer({
            buffer: buffer,
            startNum: 3,
            endNum: 21,
            cellHandler: aliPayExcelCellHandle,
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
   * @param {CreateAliPayDto} createAliPayDto
   * @return {Promise<IResponse>}
   */
  public save(userId: string, createAliPayDto: CreateAliPayDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createAliPayDto })
        // 添加
        .then(async ({ userId, body }) => {
          await this.aliPayModel.create({
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
              message: '导入的数据交易时间全部和数据库的相同！',
            };
          await this.aliPayModel.create(...filterArr.map((m) => ({ ...m, userId })));
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
          const { size, current, tradeOtherPerson, inflowOrOutflow, billType } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: any = {
            userId,
            $or: [{ tradeOtherPerson: { $regex: tradeOtherPerson } }, { tradeOtherPersonRemarks: { $regex: tradeOtherPerson } }],
          };
          if (inflowOrOutflow) findData.inflowOrOutflow = inflowOrOutflow;
          if (billType) findData.billType = billType;
          const total = await this.aliPayModel.find(findData).count();
          const list = await this.aliPayModel.find(findData).sort({ tradeTime: 1 }).limit(limit).skip(skip);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              current,
              list: list.map(
                ({
                  _id,
                  userId,
                  tradeTime,
                  transactionClassification,
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
                }) => ({
                  aliPayId: _id,
                  userId,
                  tradeTime,
                  transactionClassification,
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
   * @description: 修改支付宝账单
   * @param {UpdateAliPayDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateAliPayDto): Promise<IResponse> {
    return (
      Promise.resolve({ body })
        .then(async ({ body }) => {
          const { aliPayId, tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType } = body;
          await this.aliPayModel.updateOne({ _id: aliPayId }, { tradeOtherPersonRemarks, inflowOrOutflow, explain, place, billType });
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
