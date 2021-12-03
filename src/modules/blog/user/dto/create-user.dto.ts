import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/interfaces/user.interface';

export class CreateUserDto extends User {
  @ApiProperty({
    example: '123123',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @ApiProperty({
    example: 'text',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;
}
