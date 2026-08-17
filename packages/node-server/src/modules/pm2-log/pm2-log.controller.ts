import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { Pm2LogService } from './pm2-log.service';
import { GetLogDto } from './dto/get-log.dto';

@Controller('pm2-log')
@ApiTags('运行日志')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class Pm2LogController {
  constructor(private readonly pm2LogService: Pm2LogService) {}

  @Get('processes')
  @ApiOperation({ summary: '获取 pm2 进程列表' })
  listProcesses() {
    return this.pm2LogService.listProcesses();
  }

  @Post('log')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '获取指定进程日志' })
  getLog(@Body() body: GetLogDto) {
    return this.pm2LogService.getLog(body.name, body.lines, body.type);
  }
}
