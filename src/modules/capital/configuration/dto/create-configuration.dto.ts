import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

class HeaderSettingDto {
  @ApiProperty({
    description: '固定顶部',
    example: true,
  })
  @IsBoolean({ message: '显示重载按钮' })
  fixed: boolean;

  @ApiProperty({
    description: '显示重载按钮',
    example: true,
  })
  @IsBoolean({ message: '显示重载按钮' })
  isReload: boolean;
}

export class CreateConfigurationDto {
  @ApiProperty({
    description: '深色主题',
    example: false,
  })
  @IsBoolean({ message: '深色主题' })
  isDarkTheme: boolean;

  @ApiProperty({
    description: '系统主题色',
    example: '#2d8cf0',
  })
  @IsNotEmpty({ message: '系统主题色不能为空' })
  appTheme: string;

  @ApiProperty({
    description: '顶部',
  })
  headerSetting: HeaderSettingDto;
}
