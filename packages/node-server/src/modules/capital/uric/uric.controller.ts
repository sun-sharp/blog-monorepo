import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { UricService } from './uric.service';
import { CreateUricDto } from './dto/create-uric.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
// import { UpdateUricDto } from './dto/update-uric.dto';

@Controller('uric')
@ApiTags('尿酸血糖测量记录')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class UricController {
  constructor(private readonly uricService: UricService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建尿酸血糖测量记录' })
  create(@Body() createUricDto: CreateUricDto) {
    return this.uricService.create(createUricDto);
  }
}
