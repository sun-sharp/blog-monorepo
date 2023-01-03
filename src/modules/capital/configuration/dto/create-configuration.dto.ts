import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

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
}
