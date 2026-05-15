import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: '全局类型id',
  })
  @IsString({ message: '全局类型id必须是字符串' })
  @IsNotEmpty({ message: '全局类型id不能为空' })
  readonly categoryId: string;
}
