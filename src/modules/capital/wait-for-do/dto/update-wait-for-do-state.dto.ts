import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateWaitForDoStateDto {
  @ApiProperty({
    description: '待办id',
  })
  @IsString({ message: '待办id必须是字符串' })
  @IsNotEmpty({ message: '待办id不能为空' })
  readonly waitForDoId: string;

  @ApiProperty({
    description: '状态',
  })
  @IsInt({ message: '状态必现是整数' })
  @IsNotEmpty({ message: '状态不能为空' })
  state: number;
}
