import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * @description: 修改银行卡片验证
 */
export class UpdateBankCardDto {
  @ApiProperty({
    description: '银行卡片id',
  })
  @IsString({ message: '银行卡片id必须是字符串' })
  @IsNotEmpty({ message: '银行卡片id不能为空' })
  readonly bankCardId: string;

  @ApiProperty({
    description: '银行类型',
    required: false,
  })
  @IsOptional()
  bankType: number;

  @ApiProperty({
    description: '凭证类型(1存折/2储蓄卡/3信用卡)',
    required: false,
  })
  @IsOptional()
  voucherType: number;

  @ApiProperty({
    description: '状态：1=在用, 2=已报废',
    required: false,
  })
  @IsOptional()
  status: number;

  @ApiProperty({
    description: '说明/备注',
    required: false,
  })
  @IsOptional()
  cardRemark: string;

  @ApiProperty({
    description: '换卡后的新卡号',
    required: false,
  })
  @IsOptional()
  replaceCardNo: string;

  @ApiProperty({
    description: '本卡由旧卡替换而来',
    required: false,
  })
  @IsOptional()
  oldCardNo: string;

  @ApiProperty({
    description: '换卡/报废时间',
    required: false,
  })
  @IsOptional()
  replaceTime: string;
}