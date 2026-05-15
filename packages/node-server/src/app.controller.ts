import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('APP主模块')
export class AppController {
  constructor(private readonly appService: AppService) {}
}
