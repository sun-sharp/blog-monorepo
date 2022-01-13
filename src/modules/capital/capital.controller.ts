import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CapitalService } from './capital.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RoleMenuDto } from './dto/role-menu.dto';

@Controller('capital')
@ApiTags('系统')
export class CapitalController {
  constructor(private readonly capitalService: CapitalService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: '用户登录',
  })
  userLogin(@Body() loginUserDto: LoginUserDto) {
    return this.capitalService.login(loginUserDto);
  }

  @Get('role_menu')
  @ApiOperation({ summary: '路由权限获取管理系统菜单列表' })
  roleMenu(@Query() query: RoleMenuDto) {
    return this.capitalService.roleMenu(query);
  }
}
