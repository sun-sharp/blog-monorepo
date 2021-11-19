import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';

@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  @Get()
  @ApiOperation({ summary: '显示列表数据' })
  async index() {
    return await this.userModel.find();
  }
}
