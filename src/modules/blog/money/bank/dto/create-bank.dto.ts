import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

/**
 * @description: 单个创建银行账单验证
 */
export class CreateBankDto {
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
    description: '银行类型',
  })
  bankType: string;

  @ApiProperty({
    description: '凭证类型',
  })
  voucherType: string;

  @ApiProperty({
    description: '凭证号码',
  })
  voucherNo: string;

  @ApiProperty({
    description: '交易对方',
  })
  tradeOtherPerson: string;

  @ApiProperty({
    description: '交易对方账号',
  })
  tradeOtherPersonAccount: string;

  @ApiProperty({
    description: '交易对方备注',
  })
  tradeOtherPersonRemarks: string;

  @ApiProperty({
    description: '收/支',
  })
  incomeOrPay: string;

  @ApiProperty({
    description: '交易金额',
  })
  moneyAmount: number;

  @ApiProperty({
    description: '余额',
  })
  balance: number;

  @ApiProperty({
    description: '其它费用',
  })
  otherCost: number;

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
    description: '银行账单类型',
  })
  @IsNotEmpty({ message: '银行账单类型不能为空！' })
  readonly bankBillType: number;
}

/**
 * @description: 批量创建银行账单验证
 */
export class CreateBankBatchDto {
  @ApiProperty({
    description: '批量导入',
  })
  @IsNotEmpty({ message: '批量导入数据不能为空！' })
  @IsArray({ message: '批量导入的数据必须是数组格式！' })
  @ValidateNested({ each: true, message: '批量导入数据出错！' })
  @Type(() => CreateBankDto)
  readonly batches: CreateBankDto[];
}
