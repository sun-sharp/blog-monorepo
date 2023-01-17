import { Controller, UseGuards, HttpCode, Post, Request, Body, Get, Put, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Controller('configuration')
@ApiTags('配置')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建配置信息' })
  save(@Request() req: any, @Body() body: CreateConfigurationDto) {
    return this.configurationService.save(req.user._id, body);
  }

  @Put('update')
  @ApiOperation({ summary: '修改配置信息' })
  update(@Request() req: any, @Body() body: UpdateConfigurationDto) {
    return this.configurationService.update(req.user._id, body);
  }

  @Get('info')
  @ApiOperation({ summary: '获取用户的配置信息' })
  findInfo(@Request() req: any) {
    return this.configurationService.findOneById(req.user._id);
  }

  @Delete('remove')
  @ApiOperation({ summary: '删除用户的配置信息' })
  remove(@Request() req: any) {
    return this.configurationService.remove(req.user._id);
  }
}
