import { Controller, Post, Request, Body, UseGuards, HttpCode, Put, Delete, Param, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ScheduleService } from './schedule.service';
import { PageScheduleDto } from './dto/page-schedule.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { StatisticsStartEndTimeDto } from 'src/common/dto/statistics-start-end-time.dto';

@Controller('schedule')
@ApiTags('日程')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('find_page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取列表' })
  findPage(@Request() req, @Body() pageScheduleDto: PageScheduleDto) {
    return this.scheduleService.findPage(req.user, pageScheduleDto);
  }

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '新增' })
  save(@Request() req: any, @Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.save(req.user, createScheduleDto);
  }

  @Put('update')
  @ApiOperation({ summary: '修改' })
  update(@Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }

  @Get('daily')
  @ApiOperation({ summary: '每日的日程' })
  daily(@Request() req: any, @Query() query: StatisticsStartEndTimeDto) {
    return this.scheduleService.daily(req.user._id, query);
  }

  @Get('one/:id')
  @ApiOperation({ summary: '获取日程详情' })
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOneByScheduleId(id);
  }
}
