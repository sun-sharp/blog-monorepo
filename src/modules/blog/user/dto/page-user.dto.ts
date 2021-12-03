import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageUserDto extends PaginateDto {
  @ApiProperty({
    description: '昵称',
    // example: 'text',
  })
  readonly name: string = '';

  @ApiProperty({
    description: '用户名',
    example: 'text',
  })
  readonly username: string = '';
}
