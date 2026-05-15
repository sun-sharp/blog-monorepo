import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  // 系统主题
  @Prop()
  appTheme: string;

  // 系统主题色
  @Prop()
  appThemeColor: string;

  // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  @Prop()
  navMode: string;

  // 侧边栏深色主题
  @Prop()
  siderIsDark: boolean;

  // 顶栏样式
  @Prop()
  headIsDark: boolean;

  // 固定顶栏
  @Prop()
  headFixed: boolean;

  // 显示标签页
  @Prop()
  tabsViewShow: boolean;

  // 固定标签页
  @Prop()
  tabsViewFixed: boolean;

  // 显示页脚
  @Prop()
  footerShow: boolean;

  // 固定页脚
  @Prop()
  footerFixed: boolean;

  // 显示重载页面按钮
  @Prop()
  headerReloadShow: boolean;

  // 显示面包屑导航
  @Prop()
  headerBreadcrumbShow: boolean;

  // 显示面包屑显示图标
  @Prop()
  headerBreadcrumbShowIcon: boolean;

  // 页面跳转动画
  @Prop()
  hasPageAnimate: boolean;

  // 页面跳转动画类型
  @Prop()
  pageAnimateType: string;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
