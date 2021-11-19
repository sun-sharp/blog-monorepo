import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSchema } from './user.schema';

@Controller('user')
@ApiTags('用户')
export class UserController {
  @Get()
  @ApiOperation({ summary: '显示列表数据' })
  async index() {
    return await UserSchema.find();
  }
}
