import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

/**
 * @description: 单个创建微信账单验证
 */
export class CreateAliPayDto {
  @ApiProperty({
    description: '交易时间',
  })
  @IsNotEmpty({ message: '交易时间不能为空！' })
  tradeTime: string;

  @ApiProperty({
    description: '交易类型',
  })
  tradeType: string;

  @ApiProperty({
    description: '交易对方',
  })
  tradeOtherPerson: string;

  @ApiProperty({
    description: '交易对方备注',
  })
  tradeOtherPersonRemarks: string;

  @ApiProperty({
    description: '商品',
  })
  goods: string;

  @ApiProperty({
    description: '收/支',
  })
  incomeOrPay: string;

  @ApiProperty({
    description: '金额(元)',
  })
  @IsNotEmpty({ message: '金额(元)不能为空！' })
  moneyAmount: number;

  @ApiProperty({
    description: '支付方式',
  })
  paymentMethod: string;

  @ApiProperty({
    description: '当前状态',
  })
  currentStatus: string;

  @ApiProperty({
    description: '备注',
  })
  remarks: string;

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

/**
 * @description: 批量创建微信账单验证
 */
export class CreateAliPayBatchDto {
  @ApiProperty({
    description: '批量导入',
  })
  @IsNotEmpty({ message: '批量导入数据不能为空！' })
  @IsArray({ message: '批量导入的数据必须是数组格式！' })
  @ValidateNested({ each: true, message: '批量导入数据出错！' })
  @Type(() => CreateAliPayDto)
  readonly batches: CreateAliPayDto[];
}
