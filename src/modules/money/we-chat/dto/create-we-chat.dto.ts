import { ApiProperty } from '@nestjs/swagger';

export class CreateWeChatDto {
  @ApiProperty({
    description: '交易时间',
    example: '31/3/2021  19:55:22',
  })
  tradeTime: string;

  @ApiProperty({
    description: '交易时间',
    example: '扫二维码付款',
  })
  tradeType: string;

  @ApiProperty({
    description: '交易对方',
    example: '🍀 蓝色天空🌸',
  })
  tradeOtherPerson: string;

  @ApiProperty({
    description: '商品',
    example: '收款方备注:二维码收款',
  })
  goods: string;

  @ApiProperty({
    description: '收/支',
    example: '支出',
  })
  incomeOrPay: string;

  @ApiProperty({
    description: '金额(元)',
    example: 6,
  })
  moneyAmount: number;

  @ApiProperty({
    description: '支付方式',
    example: '零钱',
  })
  paymentMethod: string;

  @ApiProperty({
    description: '当前状态',
    example: '已转账',
  })
  currentStatus: string;

  @ApiProperty({
    description: '交易单号',
    example: '100004990121033100090332291786019367',
  })
  transactionNo: string;

  @ApiProperty({
    description: '商户单号',
    example: '10000499012021033101326078718649',
  })
  merchantNo: string;

  @ApiProperty({
    description: '备注',
    example: '/',
  })
  remarks: string;
}
