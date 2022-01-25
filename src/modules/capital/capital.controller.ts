import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { CapitalService } from './capital.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('capital')
@ApiTags('系统')
export class CapitalController {
  constructor(private readonly capitalService: CapitalService) {}

  @Post('login')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({
    summary: '用户登录',
  })
  userLogin(@Body() loginUserDto: LoginUserDto) {
    return this.capitalService.login(loginUserDto);
  }

  @Get('role_route')
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '路由权限获取管理系统菜单列表' })
  roleMenu(@Query('roleCode') roleCode: string) {
    return this.capitalService.roleMenu(roleCode);
  }
}
