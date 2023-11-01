import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { bankExcelCellMap } from 'src/common/constant/excel';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { excelXlsxHandleBuffer, twoArrForTimeSameFilter } from 'src/common/excel';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { Bank } from 'src/schemas/blog/money/bank.schema';
import { CreateBankBatchDto } from './dto/create-bank.dto';
import { PageBankDto } from './dto/page-bank.dto';
import { batchRemoveDto } from './dto/remove-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { bankExcelTargetHandler } from 'src/common/utils/money';
import { ApiBankItem, ApiBankUpload } from 'types/blog/money/bank';
import { IResponse } from 'types/common';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class BankService {
  constructor(@InjectModel(Bank.name, blogDatabaseName) private readonly bankModel: Model<Bank>) {}

  /**
   * @description: 银行账单导入
   * @param {any} file
   * @return {Promise<IResponse>}
   */
  public upload(file: any): Promise<IResponse> {
    return (
      Promise.resolve({ file })
        // 导入数据处理
        .then(async ({ file }) => {
          const { buffer } = file; // file为前端上传的excel
          let list: ApiBankUpload[] = [];
          for (const itKey in bankExcelCellMap) {
            const { sheetName, excelCellHandle } = bankExcelCellMap[itKey];
            const excelArr = await excelXlsxHandleBuffer({
              sheetName,
              buffer: buffer,
              startNum: 2,
              cellHandler: excelCellHandle,
              targetHandler: bankExcelTargetHandler,
              otherObj: { bankType: Number(itKey) },
            });
            if (!excelArr)
              throw {
                message: sheetName + '表导入的数据失败！',
              };
            list = list.concat(excelArr);
          }
          if (list.length === 0)
            throw {
              message: '导入的数据为空！',
            };
          // 过滤掉相同的数据
          const find = await this.bankModel.find();
          const result: ApiBankUpload[] = twoArrForTimeSameFilter(list, find, 'tradeTime', ['voucherType', 'voucherNo', 'moneyAmount', 'incomeOrPay']);
          if (result.length === 0)
            throw {
              message: '导入的数据全部和数据库的相同！',
            };
          // 对数据进行排序，排序优先级（银行类型，交易时间）
          result.sort(function (a, b) {
            if (a.bankType === b.bankType) {
              return b.tradeTime > a.tradeTime ? -1 : 1;
            } else {
              return b.bankType > a.bankType ? -1 : 1;
            }
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
   * @description: 批量新增银行账单
   * @param {string} userId
   * @param {CreateBankBatchDto} createBankBatchDto
   * @return {Promise<IResponse>}
   */
  public batchSave(userId: string, createBankBatchDto: CreateBankBatchDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createBankBatchDto })
        // 添加
        .then(async ({ userId, body }) => {
          const { batches } = body;
          // 过滤掉相同的数据
          const find = await this.bankModel.find();
          const filterArr = twoArrForTimeSameFilter(batches, find, 'tradeTime', ['voucherType', 'voucherNo', 'moneyAmount', 'incomeOrPay']);
          if (filterArr.length === 0)
            throw {
              message: '新增的数据全部和数据库的相同！',
            };
          await this.bankModel.create(...filterArr.map((m) => ({ ...m, userId })));
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
   * @description: 条件并分页获取银行账单
   * @param {string} userId
   * @param {PageBankDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(userId: string, body: PageBankDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body })
        // 分页查询
        .then(async ({ userId, body }) => {
          const { size, current, tradeOtherPerson, inflowOrOutflow, bankBillType, bankType } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: any = {
            userId,
          };
          if (tradeOtherPerson) findData.$or = [{ tradeOtherPerson: { $regex: tradeOtherPerson } }, { tradeOtherPersonRemarks: { $regex: tradeOtherPerson } }];
          if (inflowOrOutflow) findData.inflowOrOutflow = inflowOrOutflow;
          if (bankBillType) findData.bankBillType = bankBillType;
          if (bankType) findData.bankType = bankType;
          const total = await this.bankModel.find(findData).count();
          const findArr = await this.bankModel.find(findData).sort({ tradeTime: -1 }).limit(limit).skip(skip);
          const list: ApiBankItem[] = findArr.map(
            ({
              _id,
              userId,
              tradeTime,
              tradeType,
              bankType,
              voucherType,
              voucherNo,
              tradeOtherPerson,
              tradeOtherPersonAccount,
              tradeOtherPersonRemarks,
              incomeOrPay,
              moneyAmount,
              balance,
              otherCost,
              inflowOrOutflow,
              explain,
              place,
              bankBillType,
            }) => ({
              bankId: _id,
              userId,
              tradeTime,
              tradeType,
              bankType,
              voucherType,
              voucherNo,
              tradeOtherPerson,
              tradeOtherPersonAccount,
              tradeOtherPersonRemarks,
              incomeOrPay,
              moneyAmount,
              balance,
              otherCost,
              inflowOrOutflow,
              explain,
              place,
              bankBillType,
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
   * @description: 修改银行账单
   * @param {UpdateBankDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateBankDto): Promise<IResponse> {
    return (
      Promise.resolve({ body })
        .then(async ({ body }) => {
          const { bankId, tradeOtherPersonRemarks, inflowOrOutflow, explain, place, bankBillType, otherCost } = body;
          await this.bankModel.updateOne({ _id: bankId }, { tradeOtherPersonRemarks, inflowOrOutflow, explain, place, bankBillType, otherCost });
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
   * @description: 根据交易时间范围查询全部银行账单
   * @param {string} userId
   * @param {string} startTime?
   * @param {string} endTime?
   * @return {Promise<Array<Bank>>}
   */
  public findModelAll(userId: string, startTime?: string, endTime?: string): Promise<Array<Bank>> {
    return (
      Promise.resolve()
        .then(async () => {
          const findData: any = { userId };
          if (startTime && endTime) findData.tradeTime = { $gte: startTime, $lte: endTime };
          return await this.bankModel.find(findData).sort({ tradeTime: 1 });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 批量删除银行账单的数据
   * @param {batchRemoveDto} body
   * @return {Promise<IResponse>}
   */
  public batchRemove(body: batchRemoveDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        .then(async ({ bankIdArr }) => {
          await this.bankModel.deleteMany({ _id: { $in: bankIdArr } });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 删除银行账单的数据
   * @param {string} bankId
   * @return {Promise<IResponse>}
   */
  public remove(bankId: string): Promise<IResponse> {
    return (
      Promise.resolve(bankId)
        .then(async (bankId) => {
          await this.bankModel.deleteOne({ _id: bankId });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          };
        })
    );
  }
}
