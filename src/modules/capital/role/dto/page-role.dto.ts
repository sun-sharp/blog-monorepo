import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaginateDto } from 'src/common/paginate/paginate.dto';

export class PageRoleDto extends PaginateDto {
  @ApiProperty({
    description: '角色名称',
    required: false,
  })
  @IsString({ message: '角色名称必须是字符串' })
  readonly name: string;

  @ApiProperty({
    description: '角色标识',
    required: false,
  })
  @IsString({ message: '角色标识必须是字符串' })
  readonly roleCode: string;
}
