import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { BlogSummaryService } from './blog-summary.service';

@Controller('blog')
@ApiTags('博客汇总')
export class BlogSummaryController {
  constructor(private readonly blogSummaryService: BlogSummaryService) {}

  @Get()
  @ApiOperation({
    summary: '博客首页汇总',
  })
  index() {
    return '博客汇总内容';
  }

  @Get('home_statistics')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '首页统计数据' })
  homeStatistics(@Request() req: any) {
    const userId = req.user?._id;
    const roleCode = req.user?.roleCode;
    if (!userId || !roleCode) {
      return { code: ApiCode.ERROR, message: '用户信息缺失！' };
    }
    return this.blogSummaryService.homeStatistics(userId, roleCode);
  }
}
