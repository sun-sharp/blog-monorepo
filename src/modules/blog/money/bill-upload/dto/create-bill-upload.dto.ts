import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBillUploadDto {
  @ApiProperty({
    description: '账单导入类型',
  })
  @IsNotEmpty({ message: '账单导入类型不能为空' })
  @IsInt({ message: '账单导入类型必须是整数' })
  billUploadType: number;

  @ApiProperty({
    description: '账单判断字段',
  })
  billJudgeKey: string;

  @ApiProperty({
    description: '需处理类型',
  })
  @IsNotEmpty({ message: '需处理类型不能为空' })
  handleType: string;

  @ApiProperty({
    description: '流入/流出',
  })
  inflowOrOutflow: number;

  @ApiProperty({
    description: '账单类型',
  })
  billType: number;

  @ApiProperty({
    description: '账单方式',
  })
  billMethod: number;

  @ApiProperty({
    description: '判断方式',
  })
  judgeWay: string;

  @ApiProperty({
    description: '判断取值',
  })
  readonly judgeVal: Array<string>;

  @ApiProperty({
    description: '优先权重',
  })
  priorityWeight: number;
}
