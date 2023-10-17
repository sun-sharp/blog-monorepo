import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { Configuration } from 'src/schemas/capital/configuration.schema';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ApiConfiguration } from 'types/capital/configuration';
import { IResponse } from 'types/common';

@Injectable()
export class ConfigurationService {
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
            throw {
              code: ApiCode.ERROR,
              message: '用户已添加配置',
            };
          return { userId, body };
        })
        // 添加
        .then(async ({ userId, body }) => {
          await this.configurationModel.create({
            ...body,
            createTime: nowDateFun(),
            userId,
          });
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '添加失败！',
          };
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
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          };
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
          const config = await this.configurationModel.findOne({ userId }).lean();
          const result: ApiConfiguration = {
            userId: config.userId,
            // 系统主题
            appTheme: config.appTheme,
            // 系统主题色
            appThemeColor: config.appThemeColor,
            // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
            navMode: config.navMode,
            // 侧边栏样式
            siderIsDark: config.siderIsDark,
            // 顶栏样式
            headIsDark: config.headIsDark,
            // 固定顶栏
            headFixed: config.headFixed,
            // 固定标签页
            tabsViewShow: config.tabsViewShow,
            // 固定标签页
            tabsViewFixed: config.tabsViewFixed,
            // 显示页脚
            footerShow: config.footerShow,
            // 固定页脚
            footerFixed: config.footerFixed,
            // 显示重载页面按钮
            headerReloadShow: config.headerReloadShow,
            // 显示面包屑导航
            headerBreadcrumbShow: config.headerBreadcrumbShow,
            // 显示面包屑显示图标
            headerBreadcrumbShowIcon: config.headerBreadcrumbShowIcon,
            // 页面跳转动画
            hasPageAnimate: config.hasPageAnimate,
            // 页面跳转动画类型
            pageAnimateType: config.pageAnimateType,
          };
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          };
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
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          };
        })
    );
  }
}
