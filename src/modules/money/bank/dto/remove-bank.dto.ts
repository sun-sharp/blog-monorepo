import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class batchRemoveDto {
  @ApiProperty({ description: '文件全银行账单id数组', type: 'string[]' })
  @IsArray({ message: '银行账单id必须是数组' })
  @ArrayNotEmpty({ message: '银行账单id数组不能为空' })
  bankIdArr: string[];
}
