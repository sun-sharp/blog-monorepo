import { ApiProperty } from '@nestjs/swagger';

export class UploadAliPayDto {
  @ApiProperty({ type: 'string', format: 'binary', description: '支付宝账单文件' })
  file: any;

  @ApiProperty({ required: false, description: '数据起始行号，默认 26（支付宝账单）' })
  startNum?: number;

  @ApiProperty({ required: false, description: '数据结束行号（包含），不传则到末尾' })
  endNum?: number;
}
