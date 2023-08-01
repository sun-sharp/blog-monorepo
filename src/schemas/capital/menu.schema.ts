import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 菜单数据字段
 * @date 21/11/2021
 * @export
 * @class Menu
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class Menu extends Document {
  // 菜单的唯一标识
  @Prop()
  name: string;

  // 菜单的名称
  @Prop()
  title: string;

  // 上级菜单的id
  @Prop()
  parentId: string;

  // 菜单类型
  @Prop()
  menuType: number;

  // 菜单是否隐藏
  @Prop()
  hidden: boolean;

  // 组件内容或地址
  @Prop()
  component: string;

  // 菜单的排序
  @Prop()
  sort: number;

  // 菜单的图标
  @Prop()
  icon: string;

  // 内嵌iframe地址
  @Prop()
  iframeSrc: string;

  // 外链跳转地址
  @Prop()
  externalLink: string;

  // 是否不缓存
  @Prop()
  noKeepAlive: boolean;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
