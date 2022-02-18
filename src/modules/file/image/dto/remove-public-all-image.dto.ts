import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class RemovePublicAllImageDto {
  @ApiProperty({ description: '文件全称数组', type: 'string[]' })
  @IsArray({ message: '文件全称必须是数组' })
  @ArrayNotEmpty({ message: '文件全称数组不能为空' })
  fileNameArr: string[];
}
