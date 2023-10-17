import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

/**
 * @description: 创建主题
 * @export
 * @class CreateConfigurationDto
 */
export class CreateConfigurationDto {
  @ApiProperty({
    description: '深色主题',
    example: 'light',
  })
  @IsNotEmpty({ message: '系统主题不能为空' })
  appTheme: string;

  @ApiProperty({
    description: '系统主题色',
    example: '#2d8cf0',
  })
  @IsNotEmpty({ message: '系统主题色不能为空' })
  appThemeColor: string;

  @ApiProperty({
    description: '导航模式',
    example: 'vertical',
  })
  @IsNotEmpty({ message: '导航模式不能为空' })
  navMode: string;

  @ApiProperty({
    description: '侧边栏样式',
    example: false,
  })
  @IsBoolean({ message: '侧边栏样式必须是枚举值' })
  siderIsDark: boolean;

  @ApiProperty({
    description: '顶栏样式',
  })
  @IsBoolean({ message: '顶栏样式必须是枚举值' })
  headIsDark: boolean;

  @ApiProperty({
    description: '固定顶栏',
  })
  @IsBoolean({ message: '顶栏样式必须是枚举值' })
  headFixed: boolean;

  @ApiProperty({
    description: '显示标签页',
  })
  @IsBoolean({ message: '顶栏样式必须是枚举值' })
  tabsViewShow: boolean;

  @ApiProperty({
    description: '固定标签页',
  })
  @IsBoolean({ message: '固定标签页必须是枚举值' })
  tabsViewFixed: boolean;

  @ApiProperty({
    description: '显示页脚',
  })
  @IsBoolean({ message: '显示页脚必须是枚举值' })
  footerShow: boolean;

  @ApiProperty({
    description: '固定页脚',
  })
  @IsBoolean({ message: '固定页脚须是枚举值' })
  footerFixed: boolean;

  @ApiProperty({
    description: '显示重载页面按钮',
  })
  @IsBoolean({ message: '显示重载页面按钮必须是枚举值' })
  headerReloadShow: boolean;

  @ApiProperty({
    description: '显示面包屑导航',
  })
  @IsBoolean({ message: '显示面包屑导航必须是枚举值' })
  headerBreadcrumbShow: boolean;

  @ApiProperty({
    description: '显示面包屑显示图标',
  })
  @IsBoolean({ message: '显示面包屑显示图标必须是枚举值' })
  headerBreadcrumbShowIcon: boolean;

  @ApiProperty({
    description: '页面跳转动画',
  })
  @IsBoolean({ message: '页面跳转动画必须是枚举值' })
  hasPageAnimate: boolean;

  // 页面跳转动画类型
  @ApiProperty({
    description: '页面跳转动画类型',
  })
  @IsNotEmpty({ message: '页面跳转动画类型不能为空' })
  pageAnimateType: string;
}
