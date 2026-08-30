import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { BankCard } from 'src/schemas/blog/money/bank-card.schema';
import { CreateBankCardDto } from './dto/create-bank-card.dto';
import { PageBankCardDto } from './dto/page-bank-card.dto';
import { UpdateBankCardDto } from './dto/update-bank-card.dto';
import { ApiBankCardItem } from '/#/api/blog/money/bank-card';
import { IResponse } from '/#/common/common';
import { useCustomConfig } from 'src/config';
import { nowDateFun } from 'src/common/date';
import { logger } from 'src/common/journal';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class BankCardService {
  constructor(
    @InjectModel(BankCard.name, blogDatabaseName) private readonly bankCardModel: Model<BankCard>,
  ) {}

  /**
   * @description: 新增银行卡片
   * @param {string} userId
   * @param {CreateBankCardDto} createBankCardDto
   * @return {Promise<IResponse>}
   */
  public save(userId: string, createBankCardDto: CreateBankCardDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createBankCardDto })
        .then(async ({ userId, body }) => {
          // 同一用户同一银行同一卡号只允许一条
          const find = await this.bankCardModel.findOne({ userId, bankType: body.bankType, cardNo: body.cardNo });
          if (find) throw '该卡号已存在，请直接修改！';
          await this.bankCardModel.create({
            ...body,
            replaceTime: body.replaceTime ? new Date(body.replaceTime) : undefined,
            userId,
          });
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        .catch((err) => {
          logger.error(`银行卡片保存 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 条件并分页获取银行卡片列表
   * @param {string} userId
   * @param {PageBankCardDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(userId: string, body: PageBankCardDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body })
        .then(async ({ userId, body }) => {
          const { size, current, bankType, cardNo, status } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<BankCard> = { userId };
          if (bankType) findData.bankType = bankType;
          if (cardNo) findData.cardNo = { $regex: cardNo };
          if (status) findData.status = status;
          const total = await this.bankCardModel.find(findData).count();
          const findArr = await this.bankCardModel.find(findData).sort({ bankType: 1, createTime: -1 }).limit(limit).skip(skip);
          const list: ApiBankCardItem[] = findArr.map(
            ({ _id, bankType, voucherType, cardNo, status, cardRemark, replaceCardNo, oldCardNo, replaceTime }) => ({
              bankCardId: _id,
              bankType,
              voucherType,
              cardNo,
              status,
              cardRemark,
              replaceCardNo,
              oldCardNo,
              replaceTime: replaceTime ? nowDateFun(replaceTime) : undefined,
            }),
          );
          return {
            code: ApiCode.SUCCESS,
            result: { current, list, size, total },
            message: '查询成功！',
          };
        })
        .catch((err) => {
          logger.error(`条件并分页获取银行卡片列表 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 根据bankCardId查找银行卡片详情
   * @param {string} bankCardId
   * @return {Promise<IResponse>}
   */
  public findOne(bankCardId: string): Promise<IResponse> {
    return Promise.resolve(bankCardId)
      .then(async (bankCardId) => {
        const m = await this.bankCardModel.findOne({ _id: bankCardId }).lean();
        if (!m) throw '银行卡片不存在';
        const result: ApiBankCardItem = {
          bankCardId: m._id,
          bankType: m.bankType,
          voucherType: m.voucherType,
          cardNo: m.cardNo,
          status: m.status,
          cardRemark: m.cardRemark,
          replaceCardNo: m.replaceCardNo,
          oldCardNo: m.oldCardNo,
          replaceTime: m.replaceTime ? nowDateFun(m.replaceTime) : undefined,
        };
        return {
          code: ApiCode.SUCCESS,
          result,
          message: '查询成功！',
        };
      })
      .catch((err) => {
        logger.error(`根据bankCardId查找银行卡片详情 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: `${err}` || '查询失败！',
        };
      });
  }

  /**
   * @description: 修改银行卡片
   * @param {UpdateBankCardDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateBankCardDto): Promise<IResponse> {
    return (
      Promise.resolve({ body })
        .then(async ({ body }) => {
          const { bankCardId, bankType, voucherType, status, cardRemark, replaceCardNo, oldCardNo, replaceTime } = body;
          const updateData: any = { bankType, voucherType, status, cardRemark, replaceCardNo, oldCardNo };
          if (replaceTime) updateData.replaceTime = new Date(replaceTime);
          await this.bankCardModel.updateOne({ _id: bankCardId }, updateData);
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        .catch((err) => {
          logger.error(`修改银行卡片 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 删除银行卡片
   * @param {string} bankCardId
   * @return {Promise<IResponse>}
   */
  public remove(bankCardId: string): Promise<IResponse> {
    return (
      Promise.resolve(bankCardId)
        .then(async (bankCardId) => {
          await this.bankCardModel.deleteOne({ _id: bankCardId });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        .catch((err) => {
          logger.error(`删除银行卡片 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: `${err}` || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 校验卡号是否已报废
   * @param {string} userId
   * @param {number} bankType
   * @param {string} cardNo
   * @return {Promise<BankCard | null>}
   */
  public findByCard(userId: string, bankType: number, cardNo: string): Promise<BankCard | null> {
    return this.bankCardModel.findOne({ userId, bankType, cardNo });
  }
}