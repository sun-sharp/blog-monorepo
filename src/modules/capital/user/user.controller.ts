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

@Controller('user')
@ApiTags('用户')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('save')
  @HttpCode(200)
  @ApiOperation({ summary: '创建用户' })
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.create(createUserDto);
  }

  @Post('find_page')
  @HttpCode(200)
  @ApiOperation({ summary: '获取用户分页信息' })
  findPage(@Body() pageUserDto: PageUserDto) {
    return this.userService.findPage(pageUserDto);
  }

  @Get('admin_info')
  @ApiOperation({ summary: '获取用户信息' })
  findInfo(@Request() req) {
    return this.userService.findOneById(req.user.userId);
  }

  @Put('update_role_code')
  @ApiOperation({ summary: '修改用户权限' })
  updateUserRole(@Body() updateRoleCodeUserDto: UpdateRoleCodeUserDto) {
    return this.userService.updateUserRole(updateRoleCodeUserDto.userId, updateRoleCodeUserDto.roleCode);
  }

  @Delete(':userId')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }
}
