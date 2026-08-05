import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { WeChatModule } from './we-chat/we-chat.module';
import { AliPayModule } from './ali-pay/ali-pay.module';
import { BankModule } from './bank/bank.module';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { CategoryModule } from 'src/modules/capital/category/category.module';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';
import { BillUploadModule } from './bill-upload/bill-upload.module';
import { Bank, BankSchema } from 'src/schemas/blog/money/bank.schema';
import { AliPay, AliPaySchema } from 'src/schemas/blog/money/ali-pay.schema';
import { WeChat, WeChatSchema } from 'src/schemas/blog/money/we-chat.schema';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

const AGGREGATE_MONGO_MODULE = MongooseModule.forFeature(
  [
    { name: Bank.name, schema: BankSchema },
    { name: AliPay.name, schema: AliPaySchema },
    { name: WeChat.name, schema: WeChatSchema },
  ],
  blogDatabaseName,
);

@Module({
  imports: [
    AGGREGATE_MONGO_MODULE,
    WeChatModule,
    AliPayModule,
    BankModule,
    BillUploadModule,
    JwtAuthModule,
    UserModule,
    CategoryModule,
    forwardRef(() => RoleModule),
  ],
  controllers: [MoneyController],
  providers: [MoneyService],
  exports: [MoneyService],
})
export class MoneyModule {}
