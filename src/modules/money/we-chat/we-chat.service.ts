import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { WeChat } from 'src/schemas/we-chat.schema';
import { CreateWeChatDto } from './dto/create-we-chat.dto';
import { PageWeChatDto } from './dto/page-we-chat.dto';

@Injectable()
export class WeChatService {
  response: IResponse;
  constructor(@InjectModel('WeChat') private readonly weChatModel: Model<WeChat>) {}
  /**
   * @description 新增微信账单
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
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
   * @description: 条件并分页获取微信账单
   * @param {PageUserDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(userId: string, body: PageWeChatDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body })
        // 分页查询
        .then(async ({ userId, body }) => {
          const { size, current, tradeOtherPerson } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData = { userId, tradeOtherPerson: { $regex: tradeOtherPerson } };
          const total = await this.weChatModel.find(findData).count();
          const list = await this.weChatModel.find(findData).limit(limit).skip(skip);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              current,
              list: list.map((m) => ({
                weChatId: m._id,
                userId: m.userId,
                tradeTime: m.tradeTime,
                tradeType: m.tradeType,
                tradeOtherPerson: m.tradeOtherPerson, // 交易对方
                goods: m.goods, // 商品
                incomeOrPay: m.incomeOrPay, // 收入
                moneyAmount: m.moneyAmount, // 金额(元)
                paymentMethod: m.paymentMethod, // 支付方式
                currentStatus: m.currentStatus, // 当前状态
                transactionNo: m.transactionNo, // 交易单号
                merchantNo: m.merchantNo, // 商户单号
                remarks: m.remarks, // 备注
              })),
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
}
