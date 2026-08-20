import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUricDto } from './create-uric.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUricDto extends PartialType(CreateUricDto) {
  @ApiProperty({
    description: '尿酸血糖测量记录id',
  })
  @IsString({ message: '尿酸血糖测量记录id必须是字符串' })
  @IsNotEmpty({ message: '尿酸血糖测量记录id不能为空' })
  readonly uricId: string;
}
