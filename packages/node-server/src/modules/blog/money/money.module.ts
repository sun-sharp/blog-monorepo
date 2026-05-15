import { forwardRef, Module } from '@nestjs/common';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { WeChatModule } from './we-chat/we-chat.module';
import { AliPayModule } from './ali-pay/ali-pay.module';
import { BankModule } from './bank/bank.module';
import { JwtModuleRegister } from 'src/jwt/jwt.constants';
import { CategoryModule } from 'src/modules/capital/category/category.module';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';
import { BillUploadModule } from './bill-upload/bill-upload.module';

@Module({
  imports: [WeChatModule, AliPayModule, BankModule, BillUploadModule, JwtModuleRegister, UserModule, CategoryModule, forwardRef(() => RoleModule)],
  controllers: [MoneyController],
  providers: [MoneyService],
  exports: [MoneyService],
})
export class MoneyModule {}
