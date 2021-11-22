import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('用户')
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({
    summary: '用户登录',
  })
  public async userLogin(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  @Post('save')
  @ApiOperation({ summary: '创建用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('find_page')
  @ApiOperation({ summary: '获取分页信息' })
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.userService.findPage();
  }

  @Get('admin_info')
  @ApiOperation({ summary: '获取用户信息' })
  @UseGuards(AuthGuard('jwt'))
  findInfo(@Request() req) {
    console.log(req.user);
    return req.user;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
