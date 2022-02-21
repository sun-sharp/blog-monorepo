import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({ description: '单图片上传', type: 'string', format: 'binary' })
  image: any;

  // @ApiProperty({ description: '来源', type: 'string' })
  // @IsNotEmpty({ message: '来源不能为空' })
  // source: string;
}
