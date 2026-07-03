import { ApiProperty } from '@nestjs/swagger';

export class UploadWeChatDto {
  @ApiProperty({ format: 'binary', description: '微信账单文件' })
  file: any;

  @ApiProperty({ required: false, description: '只取前 50 条数据' })
  size?: number;

  @ApiProperty({ required: false, description: '数据起始行号，默认 19（微信账单）' })
  startNum?: number;

  @ApiProperty({ required: false, description: '数据结束行号（包含），不传则到末尾' })
  endNum?: number;
}
