import { Controller, UseGuards, HttpCode, Post, Request, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';

@Controller('configuration')
@ApiTags('配置')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建配置信息' })
  save(@Request() req, @Body() body: CreateConfigurationDto) {
    return this.configurationService.save(req.user, body);
  }
}
