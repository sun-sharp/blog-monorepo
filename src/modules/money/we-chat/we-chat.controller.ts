import { Controller, Post, Body, UseGuards, HttpCode, Request } from '@nestjs/common';
import { WeChatService } from './we-chat.service';
import { CreateWeChatDto } from './dto/create-we-chat.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';

@Controller('we-chat')
@ApiTags('微信')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class WeChatController {
  constructor(private readonly weChatService: WeChatService) {}

  @Post('save')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '创建微信账单' })
  save(@Request() req, @Body() body: CreateWeChatDto) {
    return this.weChatService.save(req.user.userId, body);
  }

  // @Get()
  // findAll() {
  //   return this.weChatService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.weChatService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWeChatDto: UpdateWeChatDto) {
  //   return this.weChatService.update(+id, updateWeChatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.weChatService.remove(+id);
  // }
}
