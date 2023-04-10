import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from 'src/interfaces/response.interface';
import { Configuration } from 'src/schemas/capital/configuration.schema';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {
  response: IResponse;
  constructor(@InjectModel('Configuration') private readonly configurationModel: Model<Configuration>) {}

  /**
   * @description: 创建配置信息
   * @param {string} userId
   * @param {CreateConfigurationDto} createConfigurationDto
   * @return {Promise<IResponse>}
   */
  public save(userId: string, createConfigurationDto: CreateConfigurationDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createConfigurationDto })
        // 判断是否已经添加
        .then(async ({ userId, body }) => {
          const configFind = await this.configurationModel.findOne({ userId });
          if (configFind)
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '用户已添加配置',
            });
          return { userId, body };
        })
        // 添加
        .then(async ({ userId, body }) => {
          await this.configurationModel.create({
            ...body,
            createTime: nowDateFun(),
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
              footerSetting: config.footerSetting,
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

  /**
   * @description: 删除用户的配置信息
   * @param {string} userId
   * @return {Promise<IResponse>}
   */
  public remove(userId: string): Promise<IResponse> {
    return (
      Promise.resolve(userId)
        .then(async (userId) => {
          await this.configurationModel.deleteOne({ userId });
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          });
        })
    );
  }
}
