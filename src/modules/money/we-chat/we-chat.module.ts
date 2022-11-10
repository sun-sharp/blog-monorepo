import { Module } from '@nestjs/common';
import { WeChatService } from './we-chat.service';
import { WeChatController } from './we-chat.controller';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { WeChat, WeChatSchema } from 'src/schemas/money/we-chat.schema';
import { UserModule } from 'src/modules/capital/user/user.module';

const WE_CHAT_MONGO_MODULE = MongooseModule.forFeature([{ name: WeChat.name, schema: WeChatSchema }], 'money');

@Module({
  imports: [WE_CHAT_MONGO_MODULE, UserModule],
  controllers: [WeChatController],
  providers: [WeChatService, JwtStrategy],
  exports: [WeChatService],
})
export class WeChatModule {}
