import { Controller, Post, Body, HttpCode, UseGuards, Get, Query, Req, Put } from '@nestjs/common';
import { WaitForDoService } from './wait-for-do.service';
import { CreateWaitForDoDto } from './dto/create-wait-for-do.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { UpdateWaitForDoStateDto } from './dto/update-wait-for-do-state.dto';

@Controller('wait-for-do')
@ApiTags('待办')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class WaitForDoController {
  constructor(private readonly waitForDoService: WaitForDoService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '新增待办' })
  save(@Req() req: any, @Body() createWaitForDoDto: CreateWaitForDoDto) {
    return this.waitForDoService.save(req.user._id, createWaitForDoDto);
  }

  @Get('classify_all')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '查询某种类型，状态的所有待办' })
  classifyAll(@Query('classify') classify: number, @Query('state') state: number) {
    return this.waitForDoService.classifyAll(classify, state);
  }

  @Put('update_state')
  @ApiOperation({ summary: '修改待办的状态' })
  updateState(@Req() req: any, @Body() body: UpdateWaitForDoStateDto) {
    return this.waitForDoService.updateState(req.user._id, body);
  }
}
