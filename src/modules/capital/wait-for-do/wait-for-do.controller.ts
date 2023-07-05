import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { WaitForDoService } from './wait-for-do.service';
import { CreateWaitForDoDto } from './dto/create-wait-for-do.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

@Controller('wait-for-do')
@ApiTags('待办')
export class WaitForDoController {
  constructor(private readonly waitForDoService: WaitForDoService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '新增待办' })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  save(@Body() createWaitForDoDto: CreateWaitForDoDto) {
    return this.waitForDoService.save(createWaitForDoDto);
  }
}
