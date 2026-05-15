import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAliPayDto {
  @ApiProperty({
    description: '支付宝账单id',
  })
  @IsString({ message: '支付宝账单id必须是字符串' })
  @IsNotEmpty({ message: '支付宝账单id不能为空' })
  readonly aliPayId: string;

  @ApiProperty({
    description: '交易对方备注',
  })
  tradeOtherPersonRemarks: string;

  @ApiProperty({
    description: '流入/流出',
  })
  @IsNotEmpty({ message: '流入/流出不能为空！' })
  inflowOrOutflow: number;

  @ApiProperty({
    description: '账单说明',
  })
  explain: string;

  @ApiProperty({
    description: '使用地点',
  })
  place: string;

  @ApiProperty({
    description: '账单类型',
  })
  @IsNotEmpty({ message: '账单类型不能为空！' })
  readonly billType: number;

  @ApiProperty({
    description: '账单方式',
  })
  @IsNotEmpty({ message: '账单方式不能为空！' })
  readonly billMethod: number;
}
