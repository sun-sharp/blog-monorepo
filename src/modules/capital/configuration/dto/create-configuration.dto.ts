import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsInt, ValidateNested } from 'class-validator';

/**
 * @description 顶部字段
 * @class HeaderSettingDto
 */
class HeaderSettingDto {
  @ApiProperty({
    description: '固定顶部',
    example: true,
  })
  @IsBoolean({ message: '固定顶部必须是枚举值' })
  fixed: boolean;

  @ApiProperty({
    description: '显示重载按钮',
    example: true,
  })
  @IsBoolean({ message: '显示重载按钮必须是枚举值' })
  isReload: boolean;
}

/**
 * @description 多标签字段
 * @class MultiTabsSettingDto
 */
class MultiTabsSettingDto {
  @ApiProperty({
    description: '是否显示多标签',
    example: true,
  })
  @IsBoolean({ message: '是否显示多标签必须是枚举值' })
  show: boolean;

  @ApiProperty({
    description: '固定多标签',
    example: true,
  })
  @IsBoolean({ message: '固定多标签必须是枚举值' })
  fixed: boolean;
}

/**
 * @description 菜单
 * @class MenuSettingDto
 */
class MenuSettingDto {
  @ApiProperty({
    description: '菜单最小宽度',
    example: 64,
  })
  @IsInt({ message: '菜单最小宽度必须是整数' })
  minMenuWidth: number;

  @ApiProperty({
    description: '菜单宽度',
    example: 200,
  })
  @IsInt({ message: '菜单宽度必须是整数' })
  menuWidth: number;

  @ApiProperty({
    description: '固定菜单',
    example: true,
  })
  @IsBoolean({ message: '固定菜单必须是枚举值' })
  fixed: boolean;

  @ApiProperty({
    description: '分割菜单',
    example: false,
  })
  @IsBoolean({ message: '分割菜单必须是枚举值' })
  mixMenu: boolean;

  @ApiProperty({
    description: '默认展开',
    example: false,
  })
  @IsBoolean({ message: '默认展开必须是枚举值' })
  collapsed: boolean;
}

/**
 * @description 面包屑
 * @class CrumbsSettingDto
 */
class CrumbsSettingDto {
  @ApiProperty({
    description: '是否显示',
    example: true,
  })
  @IsBoolean({ message: '默认展开必须是枚举值' })
  show: boolean;

  @ApiProperty({
    description: '显示图标',
    example: true,
  })
  @IsBoolean({ message: '显示图标必须是枚举值' })
  showIcon: boolean;
}

/**
 * @description 底部字段
 * @class FooterSettingDto
 */
class FooterSettingDto {
  @ApiProperty({
    description: '是否显示底部',
    example: true,
  })
  @IsBoolean({ message: '是否显示底部必须是枚举值' })
  show: boolean;

  @ApiProperty({
    description: '固定底部',
    example: true,
  })
  @IsBoolean({ message: '固定底部必须是枚举值' })
  fixed: boolean;
}

/**
 * @description: 创建主题
 * @export
 * @class CreateConfigurationDto
 */
export class CreateConfigurationDto {
  @ApiProperty({
    description: '深色主题',
    example: false,
  })
  @IsBoolean({ message: '深色主题必须是枚举值' })
  isDarkTheme: boolean;

  @ApiProperty({
    description: '系统主题色',
    example: '#2d8cf0',
  })
  @IsNotEmpty({ message: '系统主题色不能为空' })
  appTheme: string;

  @ApiProperty({
    description: '导航模式',
    example: 'vertical',
  })
  @IsNotEmpty({ message: '导航模式不能为空' })
  navMode: string;

  @ApiProperty({
    description: '导航风格',
    example: 'dark',
  })
  @IsNotEmpty({ message: '导航风格不能为空' })
  navTheme: string;

  @ApiProperty({
    description: '顶部',
  })
  @ValidateNested()
  @Type(() => HeaderSettingDto)
  headerSetting: HeaderSettingDto;

  @ApiProperty({
    description: '底部',
  })
  @ValidateNested()
  @Type(() => FooterSettingDto)
  footerSetting: FooterSettingDto;

  @ApiProperty({
    description: '多标签',
  })
  @ValidateNested()
  @Type(() => MultiTabsSettingDto)
  multiTabsSetting: MultiTabsSettingDto;

  @ApiProperty({
    description: '菜单',
  })
  @ValidateNested()
  @Type(() => MenuSettingDto)
  menuSetting: MenuSettingDto;

  @ApiProperty({
    description: '面包屑',
  })
  @ValidateNested()
  @Type(() => CrumbsSettingDto)
  crumbsSetting: CrumbsSettingDto;

  @ApiProperty({
    description: '是否开启路由动画',
    example: true,
  })
  @IsBoolean({ message: '是否开启路由动画必须是枚举值' })
  isPageAnimate: boolean;

  @ApiProperty({
    description: '路由动画类型',
    example: 'zoom-fade',
  })
  @IsNotEmpty({ message: '路由动画类型不能为空' })
  pageAnimateType: string;
}
