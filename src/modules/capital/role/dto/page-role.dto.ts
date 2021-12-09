import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageUserDto extends PaginateDto {
  @ApiProperty({
    description: '昵称',
    required: false,
    default: '',
  })
  readonly name: string = '';

  @ApiProperty({
    description: '用户名',
    required: false,
    default: '',
  })
  readonly username: string = '';
}
