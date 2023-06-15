import { forwardRef, Module } from '@nestjs/common';
import { WeChatService } from './we-chat.service';
import { WeChatController } from './we-chat.controller';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';
import { WeChat, WeChatSchema } from 'src/schemas/blog/we-chat.schema';

const WE_CHAT_MONGO_MODULE = MongooseModule.forFeature([{ name: WeChat.name, schema: WeChatSchema }], 'blog');

@Module({
  imports: [WE_CHAT_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [WeChatController],
  providers: [WeChatService, JwtStrategy],
  exports: [WeChatService],
})
export class WeChatModule {}
