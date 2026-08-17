import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetLogDto {
  @ApiProperty({
    description: 'pm2 进程名称',
  })
  @IsString({ message: '进程名必须是字符串' })
  @IsNotEmpty({ message: '进程名不能为空' })
  name: string;

  @ApiPropertyOptional({
    description: '日志行数，默认 200',
    default: 200,
    example: 200,
  })
  @IsOptional()
  @IsNumber({}, { message: '行数必须为数字' })
  @Min(1, { message: '行数最小为 1' })
  @Max(5000, { message: '行数最大为 5000' })
  lines?: number;

  @ApiPropertyOptional({
    description: '日志类型：out-标准输出, error-错误输出, all-全部（默认 all）',
    default: 'all',
    enum: ['out', 'error', 'all'],
  })
  @IsOptional()
  @IsString({ message: '日志类型必须为字符串' })
  type?: string;
}
