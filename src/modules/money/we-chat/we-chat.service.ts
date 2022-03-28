import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { WeChat } from 'src/schemas/we-chat.schema';
import { CreateWeChatDto } from './dto/create-we-chat.dto';

@Injectable()
export class WeChatService {
  response: IResponse;
  constructor(@InjectModel('WeChat') private readonly weChatModel: Model<WeChat>) {}
  /**
   * @description 新增微信账单
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public create(userId: string, createWeChatDto: CreateWeChatDto): Promise<IResponse> {
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
}
