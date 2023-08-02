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
  // 用户id
  @Prop()
  userId: string;

  // 深色主题
  @Prop()
  isDarkTheme: boolean;

  // 系统主题色
  @Prop()
  appTheme: string;

  // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  @Prop()
  navMode: string;

  // 导航风格 dark 暗色侧边栏 light 白色侧边栏 header-dark 暗色顶栏
  @Prop()
  navTheme: string;

  // 顶部
  @Prop()
  headerSetting: HeaderSetting;

  // 底部
  @Prop()
  footerSetting: FooterSetting;

  // 多标签
  @Prop()
  multiTabsSetting: MultiTabsSetting;

  // 菜单
  @Prop()
  menuSetting: MenuSetting;

  // 面包屑
  @Prop()
  crumbsSetting: CrumbsSetting;

  // 是否开启路由动画
  @Prop()
  isPageAnimate: boolean;

  // 路由动画类型
  @Prop()
  pageAnimateType: string;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
