import { forwardRef, Module } from '@nestjs/common';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { WeChatModule } from './we-chat/we-chat.module';
import { RouterModule } from '@nestjs/core';
import { AliPayModule } from './ali-pay/ali-pay.module';
import { BankModule } from './bank/bank.module';
import { JwtModuleRegister } from 'src/jwt/jwt.constants';
import { RoleModule } from '../capital/role/role.module';
import { UserModule } from '../capital/user/user.module';
import { CategoryModule } from '../capital/category/category.module';

@Module({
  imports: [
    WeChatModule,
    AliPayModule,
    BankModule,
    RouterModule.register([
      {
        path: 'money',
        children: [
          {
            path: '/',
            module: WeChatModule,
          },
          {
            path: '/',
            module: AliPayModule,
          },
          {
            path: '/',
            module: BankModule,
          },
        ],
      },
    ]),
    JwtModuleRegister,
    UserModule,
    CategoryModule,
    forwardRef(() => RoleModule),
  ],
  controllers: [MoneyController],
  providers: [MoneyService],
})
export class MoneyModule {}
