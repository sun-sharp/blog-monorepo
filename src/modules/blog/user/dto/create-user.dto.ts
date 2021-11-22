import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/interfaces/user.interface';

export class CreateUserDto extends User {
  @ApiProperty({
    example: '123123',
  })
  password: string;

  @ApiProperty({
    example: 'text',
  })
  username: string;
}
