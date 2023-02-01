import { forwardRef, Module } from '@nestjs/common';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { WeChatModule } from './we-chat/we-chat.module';
import { RouterModule } from '@nestjs/core';
import { AliPayModule } from './ali-pay/ali-pay.module';
import { BankModule } from './bank/bank.module';
import { moneyMongooseModuleForRoot } from 'src/common/constant/mongoose';
import { JwtModuleRegister } from 'src/jwt/jwt.constants';
import { RoleModule } from '../capital/role/role.module';

@Module({
  imports: [
    moneyMongooseModuleForRoot,
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
    forwardRef(() => RoleModule),
  ],
  controllers: [MoneyController],
  providers: [MoneyService],
})
export class MoneyModule {}
