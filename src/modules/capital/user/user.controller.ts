/*
 * @Description: 请填写简介
 */
import { Controller, Get, Post, Body, UseGuards, Request, HttpCode, Put, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PageUserDto } from './dto/page-user.dto';
import { UpdateRoleCodeUserDto } from './dto/update-role-code-user.dto';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';

@Controller('user')
@ApiTags('用户')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建用户' })
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取用户列表' })
  findPage(@Body() body: PageUserDto) {
    return this.userService.findPage(body);
  }

  @Get('admin_info')
  @ApiOperation({ summary: '获取用户信息' })
  findInfo(@Request() req) {
    return this.userService.findOneById(req.user._id);
  }

  @Put('update_role_code')
  @ApiOperation({ summary: '修改用户权限' })
  updateUserRole(@Body() body: UpdateRoleCodeUserDto) {
    return this.userService.updateUserRole(body.userId, body.roleCode);
  }

  @Delete(':userId')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }
}
