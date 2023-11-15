import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { bankExcelCellMap } from 'src/common/constant/excel';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { excelXlsxHandleBuffer, twoArrForTimeSameFilter } from 'src/common/excel';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { Bank } from 'src/schemas/blog/money/bank.schema';
import { CreateBankBatchDto } from './dto/create-bank.dto';
import { PageBankDto } from './dto/page-bank.dto';
import { batchRemoveDto } from './dto/remove-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { ApiBank, ApiBankItem, ApiBankUpload } from 'types/blog/money/bank';
import { IResponse } from 'types/common';
import { useCustomConfig } from 'src/config';
import { format } from 'date-fns';
import { nowDateFun } from 'src/common/date';
import { logger } from 'src/common/journal';
import { BillUploadService } from '../bill-upload/bill-upload.service';
import { billUploadTypeEnum } from 'src/common/enums/money.enum';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank.name, blogDatabaseName) private readonly bankModel: Model<Bank>,
    private readonly billUploadService: BillUploadService,
  ) {}

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
              otherObj: { bankType: Number(itKey) },
            });
            if (!excelArr) throw sheetName + '表导入的数据失败！';
            list = list.concat(excelArr);
          }
          if (list.length === 0) throw '导入的数据为空！';
          // 过滤掉相同的数据
          const find = await this.bankModel.find();
          const result: ApiBankUpload[] = twoArrForTimeSameFilter(list, find, 'tradeTime', ['voucherType', 'voucherNo', 'moneyAmount', 'incomeOrPay']);
          if (result.length === 0) throw '导入的数据全部和数据库的相同！';
          // 对数据进行排序，排序优先级（交易时间）
          result.sort(function (a, b) {
            return b.tradeTime > a.tradeTime ? -1 : 1;
          });
          return result;
        })
        // 对数据进行批量处理
        .then(async (list) => {
          const billUploadList = await this.billUploadService.getDataByBillUploadType(billUploadTypeEnum.bank);
          // 处理每项数据
          const formatBillUploadItem = (m: ApiBankUpload) => {
            const item = { ...m };
            for (let i = 0; i < billUploadList.length; i++) {
              const f = billUploadList[i];
              // 判断是否赋值
              let isAssignment = false;
              if (f.judgeWay === 'includes') {
                isAssignment = isAssignment || f.judgeVal.includes(m[f.billJudgeKey]);
              } else if (f.judgeWay === 'indexOf') {
                isAssignment = isAssignment || !!f.judgeVal.find((fi) => m[f.billJudgeKey].indexOf(fi) !== -1);
              }
              if (isAssignment) {
                if (f.handleType === 'inflowOrOutflow') {
                  // 存在则不再次赋值
                  if (!item.inflowOrOutflow) {
                    item.inflowOrOutflow = f.inflowOrOutflow;
                  }
                  continue;
                } else if (isAssignment && f.handleType === 'billType') {
                  // 存在则不再次赋值
                  if (!item.bankBillType) {
                    item.bankBillType = f.billType;
                  }
                  continue;
                }
              }
            }
            return item;
          };
          const result = list.map((m) => {
            return formatBillUploadItem(m);
          });
          logger.log(`银行账单导入${result.length}个`);
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '导入成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`银行账单导入 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '导入失败！',
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
          if (filterArr.length === 0) throw '新增的数据全部和数据库的相同！';
          await this.bankModel.create(
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
          logger.error(`批量新增银行账单 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '添加失败！',
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
          const { size, current, tradeTime, tradeOtherPerson, inflowOrOutflow, bankBillType, bankType } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<Bank> = { userId };
          if (tradeTime) {
            // 筛选当天的数据
            const startTime = format(new Date(tradeTime), `yyyy-MM-dd 00:00:00`);
            const endTime = format(new Date(tradeTime), `yyyy-MM-dd 23:59:59`);
            findData.tradeTime = { $gte: startTime, $lte: endTime };
          }
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
              tradeTime: nowDateFun(tradeTime),
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
          logger.error(`条件并分页获取银行账单 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
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
          logger.error(`修改银行账单 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 根据交易时间范围查询全部银行账单
   * @param {string} userId
   * @param {string} startTime?
   * @param {string} endTime?
   * @return {Promise<ApiBank[]>}
   */
  public findModelAll(userId: string, startTime?: string, endTime?: string): Promise<ApiBank[]> {
    return (
      Promise.resolve()
        .then(async () => {
          const findData: FilterQuery<Bank> = { userId };
          if (startTime && endTime) findData.tradeTime = { $gte: startTime, $lte: endTime };
          const list = await this.bankModel.find(findData).sort({ tradeTime: 1 }).lean();
          return list.map((m) => ({
            ...m,
            tradeTime: nowDateFun(m.tradeTime),
          }));
        })
        // 返回错误
        .catch((err) => {
          logger.error(`根据交易时间范围查询全部银行账单 失败! ${err}`);
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
          logger.error(`批量删除银行账单的数据 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '删除失败！',
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
          logger.error(`删除银行账单的数据 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 获取文章数据库信息
   * @return {Promise<Bank>}
   */
  public findAllToData(): Promise<Bank> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const list = await this.bankModel.find();
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
