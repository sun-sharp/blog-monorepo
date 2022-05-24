import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { WeChat } from 'src/schemas/we-chat.schema';
import { CreateWeChatDto } from './dto/create-we-chat.dto';
import { PageWeChatDto } from './dto/page-we-chat.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class WeChatService {
  response: IResponse;
  constructor(@InjectModel('WeChat') private readonly weChatModel: Model<WeChat>) {}

  public upload(file: any): Promise<IResponse> {
    return (
      Promise.resolve({ file })
        // 导入数据处理
        .then(async ({ file }) => {
          console.log(file, 'file');
          const { buffer } = file; // file为前端上传的excel
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer); // 加载buffer文件
          const worksheet = workbook.getWorksheet(1); // 获取excel表格的第一个sheet
          if (!worksheet)
            throw {
              message: '获取表格数据出错',
            };
          // console.log(worksheet);
          // const result = [];
          // worksheet.eachRow((row, rowNumber) => {
          //   console.log(row, rowNumber, 'row, rowNumber');
          //   // 第一行是表头，故从第二行获取数据
          //   // if (rowNumber > 1) {
          //   //   console.log();
          //   // }
          // });
          // console.log(result);
          // await this.weChatModel.create({
          //   ...body,
          //   userId,
          // });
          return (this.response = {
            code: ApiCode.SUCCESS,
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
