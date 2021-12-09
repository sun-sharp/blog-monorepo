import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CapitalService } from './capital.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('capital')
@ApiTags('系统')
export class CapitalController {
  constructor(private readonly capitalService: CapitalService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: '用户登录',
  })
  public async userLogin(@Body() loginUserDto: LoginUserDto) {
    return await this.capitalService.login(loginUserDto);
  }
}
