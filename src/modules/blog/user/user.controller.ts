import { Controller, Get, Post, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PageUserDto } from './dto/page-user.dto';

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
    return this.userService.create(createUserDto);
  }

  @Post('find_page')
  @HttpCode(200)
  @ApiOperation({ summary: '获取分页信息' })
  findPage(@Body() pageUserDto: PageUserDto) {
    return this.userService.findPage(pageUserDto);
  }

  @Get('admin_info')
  @ApiOperation({ summary: '获取用户信息' })
  findInfo(@Request() req) {
    return this.userService.findOneById(req.user.userId);
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
