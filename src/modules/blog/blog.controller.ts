import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('blog')
@ApiTags('博客')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: '用户登录',
  })
  public async userLogin(@Body() loginUserDto: LoginUserDto) {
    return await this.blogService.login(loginUserDto);
  }
}
