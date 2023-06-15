import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { CapitalService } from './capital.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './user/dto/create-user.dto';

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

  @Post('sign_up')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '注册用户' })
  signUp(@Body() body: CreateUserDto) {
    return this.capitalService.signUp(body);
  }

  @Get('role_route')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '路由权限获取管理系统菜单列表' })
  roleMenu(@Query('roleCode') roleCode: string) {
    return this.capitalService.roleMenu(roleCode);
  }

  @Delete('remove_user/:userId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除用户和用户相关数据' })
  removeUser(@Param('userId') userId: string) {
    return this.capitalService.removeUser(userId);
  }
}
