import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { Configuration } from 'src/schemas/capital/configuration.schema';
import { User } from 'src/schemas/capital/user.schema';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {
  response: IResponse;
  constructor(@InjectModel('Configuration') private readonly configurationModel: Model<Configuration>) {}

  /**
   * @description: 创建配置信息
   * @param {User} user
   * @param {CreateConfigurationDto} createConfigurationDto
   * @return {Promise<IResponse>}
   */
  public save(user: User, createConfigurationDto: CreateConfigurationDto): Promise<IResponse> {
    return (
      Promise.resolve({ user, body: createConfigurationDto })
        // 判断是否已经添加
        .then(async ({ user, body }) => {
          const configFind = await this.configurationModel.findOne({ userId: user._id });
          if (configFind)
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '用户已添加配置',
            });
          return { user, body };
        })
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

  /**
   * @description: 修改配置信息
   * @param {string} userId
   * @param {UpdateConfigurationDto} updateConfigurationDto
   * @return {Promise<IResponse>}
   */
  public update(userId: string, updateConfigurationDto: UpdateConfigurationDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: updateConfigurationDto })
        // 修改
        .then(async ({ userId, body }) => {
          await this.configurationModel.updateOne({ userId }, body);
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

  /**
   * @description: 获取用户的配置信息
   * @param {string} userId
   * @return {Promise<IResponse>}
   */
  public findOneById(userId: string): Promise<IResponse> {
    return (
      Promise.resolve(userId)
        // 获取信息
        .then(async (userId) => {
          const config = await this.configurationModel.findOne({ userId });
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              userId: config.userId,
              isDarkTheme: config.isDarkTheme,
              appTheme: config.appTheme,
              navMode: config.navMode,
              navTheme: config.navTheme,
              headerSetting: config.headerSetting,
              showFooter: config.showFooter,
              multiTabsSetting: config.multiTabsSetting,
              menuSetting: config.menuSetting,
              crumbsSetting: config.crumbsSetting,
              isPageAnimate: config.isPageAnimate,
              pageAnimateType: config.pageAnimateType,
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
