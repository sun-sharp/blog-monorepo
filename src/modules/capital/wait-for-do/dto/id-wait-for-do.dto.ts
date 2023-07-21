import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdWaitForDoDto {
  @ApiProperty({
    description: '待办id',
  })
  @IsString({ message: '待办id必须是字符串' })
  @IsNotEmpty({ message: '待办id不能为空' })
  readonly waitForDoId: string;
}
