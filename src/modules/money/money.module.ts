import { Module } from '@nestjs/common';
import { MoneyService } from './money.service';
import { MoneyController } from './money.controller';
import { MongooseModule } from '@nestjs/mongoose';
// import { RouterModule } from '@nestjs/core';
import { WeChatModule } from './we-chat/we-chat.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/money?authSource=admin', {
      connectionName: 'money',
    }),
    WeChatModule,
    // RouterModule.register([
    //   {
    //     path: 'money',
    //     children: [
    //       {
    //         path: '/',
    //         module: ImageModule,
    //       },
    //     ],
    //   },
    // ]),
  ],
  controllers: [MoneyController],
  providers: [MoneyService],
})
export class MoneyModule {}
