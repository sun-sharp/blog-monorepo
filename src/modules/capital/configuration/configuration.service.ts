import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { Configuration } from 'src/schemas/capital/configuration.schema';
import { User } from 'src/schemas/capital/user.schema';
import { CreateConfigurationDto } from './dto/create-configuration.dto';

@Injectable()
export class ConfigurationService {
  response: IResponse;
  constructor(@InjectModel('Configuration') private readonly configurationModel: Model<Configuration>) {}

  /**
   * @description 新增配置
   * @return {*}  {Promise<IResponse>}
   * @memberof RoleService
   */
  public save(user: User, createConfigurationDto: CreateConfigurationDto): Promise<IResponse> {
    return (
      Promise.resolve({ user, body: createConfigurationDto })
        // 添加
        .then(async ({ user, body }) => {
          await this.configurationModel.create({
            ...body,
            createTime: nowDateFun(),
            userId: user._id,
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
