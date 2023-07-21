import { Controller, Post, Body, HttpCode, UseGuards, Get, Query, Req, Put, Delete, Param } from '@nestjs/common';
import { WaitForDoService } from './wait-for-do.service';
import { CreateWaitForDoDto } from './dto/create-wait-for-do.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { UpdateWaitForDoStateDto } from './dto/update-wait-for-do-state.dto';
import { UpdateWaitForDoSortDto } from './dto/update-wait-for-do-sort.dto';
import { UpdateWaitForDoDto } from './dto/update-wait-for-do.dto';

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

  @Put('update_sort')
  @ApiOperation({ summary: '批量修改待办的排序' })
  @ApiBody({ type: [UpdateWaitForDoSortDto] })
  updateSort(@Req() req: any, @Body() body: UpdateWaitForDoSortDto[]) {
    return this.waitForDoService.updateSort(req.user._id, body);
  }

  @Put('update')
  @ApiOperation({ summary: '修改待办的名称，备注，截止时间' })
  update(@Body() body: UpdateWaitForDoDto) {
    return this.waitForDoService.update(body);
  }

  @Get(':waitForDoId')
  @ApiOperation({ summary: '查询待办详情' })
  findDetails(@Param('waitForDoId') waitForDoId: string) {
    return this.waitForDoService.findDetails(waitForDoId);
  }

  @Delete(':waitForDoId')
  @ApiOperation({ summary: '删除待办' })
  remove(@Param('waitForDoId') waitForDoId: string) {
    return this.waitForDoService.remove(waitForDoId);
  }
}
