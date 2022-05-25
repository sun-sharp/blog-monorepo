import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { aliPayExcelCellHandle } from 'src/common/constant/excel';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { excelCsvHandleBuffer, twoArrForTimeSameFilter } from 'src/common/excel';
import { IResponse } from 'src/interfaces/response.interface';
import { AliPay } from 'src/schemas/ali-pay.schema';
// import { CreateAliPayDto } from './dto/create-ali-pay.dto';
// import { UpdateAliPayDto } from './dto/update-ali-pay.dto';

@Injectable()
export class AliPayService {
  response: IResponse;
  constructor(@InjectModel('AliPay') private readonly aliPayModel: Model<AliPay>) {}
  /**
   * @description: 支付宝账单导入
   * @param {string} userId
   * @param {any} file
   * @return {Promise<IResponse>}
   */
  public upload(userId: string, file: any): Promise<IResponse> {
    return (
      Promise.resolve({ userId, file })
        // 导入数据处理
        .then(async ({ userId, file }) => {
          const { buffer } = file; // file为前端上传的excel
          // 微信的菜单处理
          const excelArr = await excelCsvHandleBuffer({
            buffer: buffer,
            startNum: 2,
            endNum: 21,
            cellHandler: aliPayExcelCellHandle,
            otherObj: { userId },
          });
          if (!excelArr)
            throw {
              message: '导入的数据失败！',
            };
          if (excelArr.length === 0)
            throw {
              message: '导入的数据为空！',
            };
          const find = await this.aliPayModel.find();
          const result = twoArrForTimeSameFilter(excelArr, find, 'tradeTime');
          if (result.length === 0)
            throw {
              message: '导入的数据交易时间全部和数据库的相同！',
            };
          await this.aliPayModel.create(...result);
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

  // create(createAliPayDto: CreateAliPayDto) {
  //   return 'This action adds a new aliPay';
  // }

  // findAll() {
  //   return `This action returns all aliPay`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} aliPay`;
  // }

  // update(id: number, updateAliPayDto: UpdateAliPayDto) {
  //   return `This action updates a #${id} aliPay`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} aliPay`;
  // }
}
