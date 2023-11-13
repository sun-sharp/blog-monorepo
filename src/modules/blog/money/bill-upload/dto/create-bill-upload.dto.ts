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
    description: '账单类型',
  })
  @IsNotEmpty({ message: '账单类型不能为空' })
  @IsInt({ message: '账单类型必须是整数' })
  billType: number;

  @ApiProperty({
    description: '账单判断字段',
  })
  billJudgeKey: string;

  @ApiProperty({
    description: '判断方式',
  })
  judgeWay: string;

  @ApiProperty({
    description: '判断取值',
  })
  readonly judgeVal: Array<string>;
}
