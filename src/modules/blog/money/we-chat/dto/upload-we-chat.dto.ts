import { ApiProperty } from '@nestjs/swagger';

export class UploadWeChatDto {
  @ApiProperty({ description: '单文件上传', type: 'string', format: 'binary' })
  file: any;
}
