import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ description: '单图片上传', type: 'string', format: 'binary' })
  image: any;

  @ApiProperty({ description: '来源', type: 'string' })
  source: string;
}
