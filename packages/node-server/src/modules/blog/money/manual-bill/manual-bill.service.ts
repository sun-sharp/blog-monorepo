import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { ManualBill } from 'src/schemas/blog/money/manual-bill.schema';
import { CreateManualBillDto } from './dto/create-manual-bill.dto';
import { PageManualBillDto } from './dto/page-manual-bill.dto';
import { UpdateManualBillDto } from './dto/update-manual-bill.dto';
import { ApiManualBillItem } from '/#/api/blog/money/manual-bill';
import { IResponse } from '/#/common/common';
import { useCustomConfig } from 'src/config';
import { nowDateFun } from 'src/common/date';
import { logger } from 'src/common/journal';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class ManualBillService {
  constructor(@InjectModel(ManualBill.name, blogDatabaseName) private readonly manualBillModel: Model<ManualBill>) {}

  /**
   * @description: 新增手写账单
   * @param {string} userId
   * @param {CreateManualBillDto} createManualBillDto
   * @return {Promise<IResponse>}
   */
  public save(userId: string, createManualBillDto: CreateManualBillDto): Promise<IResponse> {
    return Promise.resolve({ userId, body: createManualBillDto })
      .then(async ({ userId, body }) => {
        await this.manualBillModel.create({
          ...body,
          tradeTime: new Date(body.tradeTime),
          userId,
        });
        return {
          code: ApiCode.SUCCESS,
          message: '添加成功！',
        };
      })
      .catch((err) => {
        logger.error(`手写账单保存 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: `${err}` || '添加失败！',
        };
      });
  }

  /**
   * @description: 条件并分页获取手写账单列表
   * @param {string} userId
   * @param {PageManualBillDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(userId: string, body: PageManualBillDto): Promise<IResponse> {
    return Promise.resolve({ userId, body })
      .then(async ({ userId, body }) => {
        const { size, current, tradeOtherPerson, inflowOrOutflow, manualPaymentMethod, billType, billMethod } = body;
        const { limit, skip } = PaginateHandle(size, current);
        const findData: FilterQuery<ManualBill> = { userId };
        if (tradeOtherPerson) findData.tradeOtherPerson = { $regex: tradeOtherPerson };
        if (inflowOrOutflow) findData.inflowOrOutflow = inflowOrOutflow;
        if (manualPaymentMethod) findData.manualPaymentMethod = manualPaymentMethod;
        if (billType) findData.billType = billType;
        if (billMethod) findData.billMethod = billMethod;
        const total = await this.manualBillModel.find(findData).count();
        const findArr = await this.manualBillModel.find(findData).sort({ tradeTime: -1 }).limit(limit).skip(skip);
        const list: ApiManualBillItem[] = findArr.map(
          ({
            _id,
            tradeTime,
            tradeType,
            tradeOtherPerson,
            incomeOrPay,
            moneyAmount,
            otherCost,
            manualPaymentMethod,
            balance,
            inflowOrOutflow,
            explain,
            place,
            billType,
            billMethod,
          }) => ({
            manualBillId: _id,
            tradeTime: nowDateFun(tradeTime),
            tradeType,
            tradeOtherPerson,
            incomeOrPay,
            moneyAmount,
            otherCost,
            manualPaymentMethod,
            balance,
            inflowOrOutflow,
            explain,
            place,
            billType,
            billMethod,
          }),
        );
        return {
          code: ApiCode.SUCCESS,
          result: { current, list, size, total },
          message: '查询成功！',
        };
      })
      .catch((err) => {
        logger.error(`条件并分页获取手写账单列表 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: `${err}` || '查询失败！',
        };
      });
  }

  /**
   * @description: 根据manualBillId查找手写账单详情
   * @param {string} manualBillId
   * @return {Promise<IResponse>}
   */
  public findOne(manualBillId: string): Promise<IResponse> {
    return Promise.resolve(manualBillId)
      .then(async (manualBillId) => {
        const m = await this.manualBillModel.findOne({ _id: manualBillId }).lean();
        if (!m) throw '手写账单不存在';
        const result: ApiManualBillItem = {
          manualBillId: m._id,
          tradeTime: nowDateFun(m.tradeTime),
          tradeType: m.tradeType,
          tradeOtherPerson: m.tradeOtherPerson,
          incomeOrPay: m.incomeOrPay,
          moneyAmount: m.moneyAmount,
          otherCost: m.otherCost,
          manualPaymentMethod: m.manualPaymentMethod,
          balance: m.balance,
          inflowOrOutflow: m.inflowOrOutflow,
          explain: m.explain,
          place: m.place,
          billType: m.billType,
          billMethod: m.billMethod,
        };
        return {
          code: ApiCode.SUCCESS,
          result,
          message: '查询成功！',
        };
      })
      .catch((err) => {
        logger.error(`根据manualBillId查找手写账单详情 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: `${err}` || '查询失败！',
        };
      });
  }

  /**
   * @description: 修改手写账单
   * @param {UpdateManualBillDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateManualBillDto): Promise<IResponse> {
    return Promise.resolve({ body })
      .then(async ({ body }) => {
        const {
          manualBillId,
          tradeTime,
          tradeOtherPerson,
          moneyAmount,
          balance,
          inflowOrOutflow,
          explain,
          place,
          manualPaymentMethod,
          billType,
          billMethod,
          incomeOrPay,
          tradeType,
          otherCost,
        } = body;
        const updateData: any = {
          tradeOtherPerson,
          moneyAmount,
          balance,
          inflowOrOutflow,
          explain,
          place,
          manualPaymentMethod,
          billType,
          billMethod,
          incomeOrPay,
          tradeType,
          otherCost,
        };
        if (tradeTime) updateData.tradeTime = new Date(tradeTime);
        await this.manualBillModel.updateOne({ _id: manualBillId }, updateData);
        return {
          code: ApiCode.SUCCESS,
          message: '修改成功！',
        };
      })
      .catch((err) => {
        logger.error(`修改手写账单 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: `${err}` || '修改失败！',
        };
      });
  }

  /**
   * @description: 删除手写账单
   * @param {string} manualBillId
   * @return {Promise<IResponse>}
   */
  public remove(manualBillId: string): Promise<IResponse> {
    return Promise.resolve(manualBillId)
      .then(async (manualBillId) => {
        await this.manualBillModel.deleteOne({ _id: manualBillId });
        return {
          code: ApiCode.SUCCESS,
          message: '删除成功！',
        };
      })
      .catch((err) => {
        logger.error(`删除手写账单 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: `${err}` || '删除失败！',
        };
      });
  }

  /**
   * @description: 根据交易时间范围查询全部手写账单
   * @param {string} userId
   * @param {string} startTime
   * @param {string} endTime
   * @return {Promise<Array<ManualBill>>}
   */
  public findModelAll(userId: string, startTime?: string, endTime?: string): Promise<Array<ManualBill>> {
    return Promise.resolve({ userId, startTime, endTime })
      .then(async ({ userId, startTime, endTime }) => {
        const findData: any = { userId };
        if (startTime && endTime) findData.tradeTime = { $gte: new Date(startTime), $lte: new Date(endTime) };
        return await this.manualBillModel.find(findData).sort({ tradeTime: 1 });
      })
      .catch((err) => {
        logger.error(`根据交易时间范围查询全部手写账单 失败! ${err}`);
        return err;
      });
  }

  /**
   * @description: 获取手写账单数据库信息
   * @return {Promise<Array<ManualBill>>}
   */
  public findAllToData(): Promise<Array<ManualBill>> {
    return Promise.resolve()
      .then(async () => {
        const list = await this.manualBillModel.find();
        return list;
      })
      .catch((err) => {
        logger.error(`获取手写账单数据库信息 失败! ${err}`);
        return err;
      });
  }
}
