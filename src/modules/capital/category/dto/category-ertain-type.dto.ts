import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CategoryCertainTypeDto {
  @Prop()
  @ApiProperty({
    description: '分类类型',
  })
  @IsNotEmpty({ message: '分类类型不能为空' })
  readonly type: string;
}
