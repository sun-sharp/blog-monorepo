import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 顶部字段
 * @export
 * @class HeaderSetting
 */
export class HeaderSetting {
  //固定顶部
  @Prop()
  fixed: boolean;

  //显示重载按钮
  @Prop()
  isReload: boolean;
}

/**
 * @description 多标签字段
 * @export
 * @class MultiTabsSetting
 */
export class MultiTabsSetting {
  // 是否显示
  @Prop()
  show: boolean;

  // 固定多标签
  @Prop()
  fixed: boolean;
}

/**
 * @description 菜单
 * @export
 * @class MenuSetting
 */
export class MenuSetting {
  // 最小宽度
  @Prop()
  minMenuWidth: number;

  // 菜单宽度
  @Prop()
  menuWidth: number;

  // 固定菜单
  @Prop()
  fixed: boolean;

  // 分割菜单
  @Prop()
  mixMenu: boolean;

  // 默认展开
  @Prop()
  collapsed: boolean;
}

/**
 * @description 面包屑
 * @export
 * @class CrumbsSetting
 */
export class CrumbsSetting {
  // 是否显示
  @Prop()
  show: boolean;

  // 显示图标
  @Prop()
  showIcon: boolean;
}

/**
 * @description 底部字段
 * @export
 * @class FooterSetting
 */
export class FooterSetting {
  // 是否显示
  @Prop()
  show: boolean;

  //固定底部
  @Prop()
  fixed: boolean;
}

/**
 * @description 设置数据字段
 * @export
 * @class Configuration
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Configuration extends Document {
  @Prop()
  userId: string; // 用户id

  @Prop()
  isDarkTheme: boolean; // 深色主题

  @Prop()
  appTheme: string; // 系统主题色

  @Prop()
  navMode: string; // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式

  @Prop()
  navTheme: string; // 导航风格 dark 暗色侧边栏 light 白色侧边栏 header-dark 暗色顶栏

  @Prop()
  headerSetting: HeaderSetting; // 顶部

  @Prop()
  footerSetting: FooterSetting; // 底部

  @Prop()
  multiTabsSetting: MultiTabsSetting; // 多标签

  @Prop()
  menuSetting: MenuSetting; // 菜单

  @Prop()
  crumbsSetting: CrumbsSetting; // 面包屑

  @Prop()
  isPageAnimate: boolean; // 是否开启路由动画

  @Prop()
  pageAnimateType: string; // 路由动画类型
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
