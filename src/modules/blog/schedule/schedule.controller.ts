import { Controller, Post, Request, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ScheduleService } from './schedule.service';
import { PageScheduleDto } from './dto/page-schedule.dto';

@Controller('schedule')
@ApiTags('日程')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取文章列表' })
  findPage(@Request() req, @Body() pageScheduleDto: PageScheduleDto) {
    return this.scheduleService.findPage(req.user, pageScheduleDto);
  }
}
