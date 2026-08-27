import { Controller, Post, Body, UseGuards, HttpCode, Get, Param, Put, Delete, Request } from '@nestjs/common';
import { UricService } from './uric.service';
import { CreateUricDto } from './dto/create-uric.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { PageUricDto } from './dto/page-uric.dto';
import { UpdateUricDto } from './dto/update-uric.dto';

@Controller('uric')
@ApiTags('尿酸血糖测量记录')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class UricController {
  constructor(private readonly uricService: UricService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建尿酸血糖测量记录' })
  create(@Request() req: any, @Body() createUricDto: CreateUricDto) {
    return this.uricService.create(req.user?._id, createUricDto);
  }

  @Post('page')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '条件并分页获取尿酸血糖测量记录列表' })
  findPage(@Body() pageUricDto: PageUricDto) {
    return this.uricService.listPage(pageUricDto);
  }

  @Get('details/:uricId')
  @ApiOperation({ summary: '尿酸血糖测量记录详情' })
  details(@Param('uricId') uricId: string) {
    return this.uricService.details(uricId);
  }

  @Put('update')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '修改尿酸血糖测量记录' })
  update(@Body() body: UpdateUricDto) {
    return this.uricService.update(body);
  }

  @Delete(':uricId')
  @ApiOperation({ summary: '删除尿酸血糖测量记录' })
  remove(@Param('uricId') uricId: string) {
    return this.uricService.remove(uricId);
  }
}
